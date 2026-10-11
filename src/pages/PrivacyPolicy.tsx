import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { useMetadata } from "@/hooks/useMetadata";
import { usePolicySection } from "@/hooks/useSiteSections";
import { PolicyRenderer } from "@/components/policy/PolicyRenderer";

const PrivacyPolicy = () => {
  usePrerenderReady(true);
  const { policy, isPreview } = usePolicySection("policy.privacy");

  useMetadata({
    title: `${policy.title} · House of Padmavati`,
    description: policy.meta_description,
  });

  return <PolicyRenderer policy={policy} isPreview={isPreview} />;
};

export default PrivacyPolicy;