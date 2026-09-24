param(
    [Parameter(Mandatory = $true)][string]$Path
)

$ErrorActionPreference = "Stop"

$PROD_REF = "kbvjmcnaaogkbnerjcoc"

Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public static class CredUtilS {
    [DllImport("advapi32.dll", SetLastError = true, CharSet = CharSet.Unicode)]
    private static extern bool CredRead(string target, int type, int reservedFlag, out IntPtr credentialPtr);
    [DllImport("advapi32.dll", SetLastError = true)]
    private static extern void CredFree(IntPtr cred);
    [StructLayout(LayoutKind.Sequential)]
    private struct CREDENTIAL {
        public int Flags;
        public int Type;
        public IntPtr TargetName;
        public IntPtr Comment;
        public System.Runtime.InteropServices.ComTypes.FILETIME LastWritten;
        public int CredentialBlobSize;
        public IntPtr CredentialBlob;
        public int Persist;
        public int AttributeCount;
        public IntPtr Attributes;
        public IntPtr TargetAlias;
        public IntPtr UserName;
    }
    public static string ReadSecret() {
        IntPtr ptr;
        bool ok = CredRead("LegacyGeneric:target=Supabase CLI:supabase", 1, 0, out ptr);
        if (!ok) return null;
        try {
            CREDENTIAL cred = (CREDENTIAL)Marshal.PtrToStructure(ptr, typeof(CREDENTIAL));
            byte[] blob = new byte[cred.CredentialBlobSize];
            Marshal.Copy(cred.CredentialBlob, blob, 0, cred.CredentialBlobSize);
            return System.Text.Encoding.UTF8.GetString(blob);
        } finally {
            CredFree(ptr);
        }
    }
}
"@

$token = [CredUtilS]::ReadSecret()
if (-not $token -or $token.Trim() -notmatch "^sbp_") {
    Write-Error "Access token unavailable. ABORTING."
    exit 2
}
$token = $token.Trim()

$headers = @{ "Authorization" = "Bearer $token" }

$keys = Invoke-RestMethod -Uri "https://api.supabase.com/v1/projects/$PROD_REF/api-keys?reveal=true" -Method Get -Headers $headers -TimeoutSec 120
$svc = $keys | Where-Object { $_.name -eq "service_role" } | Select-Object -ExpandProperty api_key
if (-not $svc) {
    Write-Error "service_role key not found. ABORTING."
    exit 2
}

$storageHeaders = @{ "Authorization" = "Bearer $svc" }
$url = "https://$PROD_REF.supabase.co/storage/v1/object/$Path"

try {
    $r = Invoke-WebRequest -Uri $url -Method Delete -Headers $storageHeaders -TimeoutSec 120
    Write-Output "status=$($r.StatusCode) path=$Path"
} catch {
    Write-Error "STORAGE DELETE FAILED: $($_.Exception.Message)"
    exit 1
}