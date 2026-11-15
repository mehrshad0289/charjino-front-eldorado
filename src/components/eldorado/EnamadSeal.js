const ENAMAD_HTML =
  "<a referrerpolicy='origin' target='_blank' rel='noopener noreferrer' href='https://trustseal.enamad.ir/?id=8024899&Code=qvDiFe9c1B8KlWVq7X9uoP3CxmsAxMKO'><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=8024899&Code=qvDiFe9c1B8KlWVq7X9uoP3CxmsAxMKO' alt='نماد اعتماد الکترونیک' width='96' height='96' style='cursor:pointer;width:96px;height:96px' code='qvDiFe9c1B8KlWVq7X9uoP3CxmsAxMKO'></a>";

export default function EnamadSeal() {
  return (
    <div
      className="inline-flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg bg-white [&_a]:block [&_img]:h-24 [&_img]:w-24"
      dangerouslySetInnerHTML={{ __html: ENAMAD_HTML }}
    />
  );
}
