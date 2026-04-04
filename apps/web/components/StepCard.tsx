// components/StepCard.tsx
export default function StepCard({
    step,
    title,
    description,
    children,
  }: {
    step: string
    title: string
    description: string
    children: React.ReactNode
  }) {
    return (
      <div className="flex flex-col justify-between h-[420px] bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition">
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-500 mb-2">{step}</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-8">{description}</p>
        </div>
  
        {/* FORCE ALL CONTENT TO ALIGN TO BOTTOM */}
        <div className="mt-auto flex justify-center items-center h-[160px]">
  {children}
</div>
      </div>
    )
  }