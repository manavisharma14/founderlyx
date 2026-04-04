type DomainStatusProps = {
  domain?: string | null;
  spf: boolean;
  dkim1: boolean;
  dkim2: boolean;
  dmarc: boolean;
};

export default function DomainStatusCard({
  domain,
  spf,
  dkim1,
  dkim2,
  dmarc,
}: DomainStatusProps) {
  return (
    <div className="bg-white border rounded-xl p-6 mb-10">
      <h2 className="text-lg font-semibold mb-4">Domain Authentication</h2>

      {domain && (
        <div className="mb-4 text-sm text-gray-600">
          Active Domain: <span className="font-medium">{domain}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 text-sm">
        <StatusRow label="SPF" value={spf} />
        <StatusRow label="DKIM #1" value={dkim1} />

      </div>
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex justify-between border p-3 rounded">
      <span>{label}</span>
      <span>{value ? "✅ Verified" : "❌ Missing"}</span>
    </div>
  );
}