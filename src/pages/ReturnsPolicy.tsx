import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { useMetadata } from "@/hooks/useMetadata";
import { usePolicySection } from "@/hooks/useSiteSections";
import { PolicyRenderer } from "@/components/policy/PolicyRenderer";

const ReturnsPolicy = () => {
  usePrerenderReady(true);
  const { policy, isPreview } = usePolicySection("policy.returns");

  useMetadata({
    title: `${policy.title} · House of Padmavati`,
    description: policy.meta_description,
  });

  return <PolicyRenderer policy={policy} isPreview={isPreview} />;
};

export default ReturnsPolicy;