import DashboardPageHeader from "./DashboardPageHeader";

export default function OrderDashboardFrame({ title, children }) {
  return (
    <>
      <DashboardPageHeader icon="orders" title={title} />
      <div className="mt-[32px] w-full px-6 pb-[50px]">{children}</div>
    </>
  );
}
