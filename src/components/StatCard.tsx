type Props = {
  title: string;
  value: number;
  color?: string; // optional Tailwind color class
};

export default function StatCard({ title, value, color = "bg-red-100" }: Props) {
  return (
    <div className={`p-6 rounded shadow text-center ${color}`}>
      <h2 className="text-md font-semibold text-red-800">{title}</h2>
      <p className="text-3xl font-bold text-red-900">{value}</p>
    </div>
  );
}
