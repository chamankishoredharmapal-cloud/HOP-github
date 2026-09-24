param(
    [Parameter(Mandatory = $true)][string]$Sql,
    [switch]$AsCsv
)

$ErrorActionPreference = "Stop"

$PROD_REF = "kbvjmcnaaogkbnerjcoc"

Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public static class CredUtil {
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

$token = [CredUtil]::ReadSecret()
if (-not $token) {
    Write-Error "Supabase CLI access token could not be read from Credential Manager. ABORTING."
    exit 2
}
$token = $token.Trim()
if ($token -notmatch "^sbp_") {
    Write-Error "Credential store does not contain a valid Supabase access token (expected sbp_ prefix). ABORTING."
    exit 2
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type"  = "application/json"
}

$body = @{ query = $Sql } | ConvertTo-Json -Compress

$url = "https://api.supabase.com/v1/projects/$PROD_REF/database/query"

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body -ContentType "application/json" -TimeoutSec 120
} catch {
    $errBody = $_.Exception.Message
    if ($_.ErrorDetails) { $errBody = $_.ErrorDetails.Message }
    Write-Error "PRODUCTION QUERY FAILED ($PROD_REF): $errBody"
    exit 1
}

if ($AsCsv) {
    $response | ConvertTo-Csv -NoTypeInformation
} else {
    $response | ConvertTo-Json -Depth 10
}