"use client";

import { useEffect, useMemo, useState } from "react";
import GamePassRegionChips from "./GamePassRegionChips";
import ShopAmountCards from "./ShopAmountCards";
import ShopTopupNotice from "./ShopTopupNotice";
import TopupOfferCard from "./TopupOfferCard";
import ShopNoResults from "./ShopNoResults";
import { FA } from "./data/faCopy";
import { TOPUP_SHOP_CHROME } from "./data/giftShopCopy";
import { useCheckoutPreview } from "./useCheckoutPreview";
import { useCheckoutCoupon } from "./useCheckoutCoupon";

function asShop(value) {
  return value && typeof value === "object" ? value : {};
}

function instructionLines(value) {
  if (Array.isArray(value)) return value.map((line) => String(line || "").trim()).filter(Boolean);
  return String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function deviceList(shop) {
  const items = Array.isArray(shop?.devices) ? shop.devices : [];
  return items
    .map((item) => ({
      key: String(item?.key || "").trim(),
      label: String(item?.label || item?.key || "").trim(),
      identity: String(item?.identity || "").trim(),
      deliveryTime: String(item?.deliveryTime || "").trim(),
      deliveryInstructions: instructionLines(item?.deliveryInstructions),
      noticeTitle: String(item?.noticeTitle || "").trim(),
      noticeBody: String(item?.noticeBody || "").trim(),
      fields: Array.isArray(item?.fields) ? item.fields : [],
    }))
    .filter((item) => item.key && item.label);
}

function visibleBuyerFields(fields, deviceKey = "") {
  return (Array.isArray(fields) ? fields : []).filter((raw) => {
    const name = String(raw?.name || raw?.key || "")
      .trim()
      .toLowerCase();
    if (name === "" || name === "gamedevice" || name === "game_device") return false;
    const forDevices = Array.isArray(raw?.forDevices) ? raw.forDevices : [];
    if (forDevices.length === 0) return true;
    return deviceKey !== "" && forDevices.includes(deviceKey);
  });
}

function fieldsForDevice(device, fallback, deviceKey) {
  if (Array.isArray(device?.fields) && device.fields.length > 0) {
    return visibleBuyerFields(device.fields, deviceKey);
  }
  return visibleBuyerFields(fallback, deviceKey);
}

function firstMatchingDevice(devices, amounts) {
  const hit = devices.find((item) =>
    (Array.isArray(amounts) ? amounts : []).some((row) => !row.region || row.region === item.key),
  );
  return hit?.key || devices[0]?.key || null;
}

export default function TopupBuyFlow({
  regions = [],
  amounts = [],
  productIcon = "",
  buyerFieldsByHandle = {},
  shop = null,
}) {
  const chrome = asShop(shop);
  const devices = useMemo(() => deviceList(chrome), [shop]);
  const showDevices = devices.length > 0;
  const showServers = !showDevices && regions.length >= 2;
  const deviceHeading = String(chrome.deviceLabel || "").trim() || TOPUP_SHOP_CHROME.gameDevice;

  const [region, setRegion] = useState(showServers ? regions[0] : null);
  const [device, setDevice] = useState(showDevices ? firstMatchingDevice(devices, amounts) : null);
  const [selectedKey, setSelectedKey] = useState(
    () => (amounts.find((row) => row.popular) || amounts[0] || {}).key || null,
  );
  const [buyerValues, setBuyerValues] = useState({});
  const checkout = useCheckoutPreview();

  const catalogAmounts = useMemo(
    () => amounts.map((row) => ({ ...row, img: row.img || productIcon })),
    [amounts, productIcon],
  );

  const visibleAmounts = useMemo(() => {
    if (showDevices && device) {
      return catalogAmounts.filter((row) => !row.region || row.region === device);
    }
    if (!showServers || !region) return catalogAmounts;
    const filtered = catalogAmounts.filter((row) => !row.region || row.region === region);
    return filtered.length > 0 ? filtered : catalogAmounts;
  }, [catalogAmounts, device, region, showDevices, showServers]);

  useEffect(() => {
    if (!showServers) {
      setRegion(null);
      return;
    }
    if (region && regions.includes(region)) return;
    setRegion(regions[0] || null);
  }, [region, regions, showServers]);

  useEffect(() => {
    if (!showDevices) {
      setDevice(null);
      return;
    }
    if (device && devices.some((item) => item.key === device)) return;
    setDevice(firstMatchingDevice(devices, amounts));
  }, [device, devices, showDevices]);

  useEffect(() => {
    setBuyerValues({});
  }, [device]);

  useEffect(() => {
    if (visibleAmounts.length === 0) {
      setSelectedKey(null);
      return;
    }
    if (visibleAmounts.some((row) => row.key === selectedKey)) return;
    const popular = visibleAmounts.find((row) => row.popular);
    setSelectedKey((popular || visibleAmounts[0]).key);
  }, [visibleAmounts, selectedKey]);

  const variants = visibleAmounts.map((row) => ({
    key: row.key,
    label: row.label || row.name,
    sub: row.sub || "",
    price: row.from,
    discount: row.discount || "",
    was: row.was || "",
    popular: Boolean(row.popular),
    img: row.img || productIcon,
    imgAlt: row.name || row.label,
  }));
  const selected = visibleAmounts.find((row) => row.key === selectedKey) || null;
  const coupon = useCheckoutCoupon(selected?.skuId);
  const selectedDevice = devices.find((item) => item.key === device) || null;
  const fallbackFields = selected?.handle ? buyerFieldsByHandle[selected.handle] || [] : [];
  const buyerFields = fieldsForDevice(selectedDevice, fallbackFields, device || "");
  const noticeTitle = String(selectedDevice?.noticeTitle || chrome.noticeTitle || "").trim();
  const noticeBody = String(selectedDevice?.noticeBody || chrome.noticeBody || "").trim();
  const hasNotice = Boolean(noticeTitle || noticeBody);
  const hasTop = showDevices || showServers || hasNotice;

  function checkoutFields() {
    const fields = { ...buyerValues };
    if (device) fields.gameDevice = device;
    return fields;
  }

  const offer = (
    <TopupOfferCard
      selected={selected}
      showRegion={showServers}
      deviceHeading={showDevices ? deviceHeading : ""}
      deviceValue={selectedDevice?.label || ""}
      deliveryTime={selectedDevice?.deliveryTime || ""}
      deliverySteps={selectedDevice?.deliveryInstructions || []}
      ack={checkout.ack}
      onAckChange={checkout.setAck}
      message={checkout.message}
      buyerFields={buyerFields}
      buyerValues={buyerValues}
      onBuyerFieldChange={(name, value) => setBuyerValues((prev) => ({ ...prev, [name]: value }))}
      coupon={coupon}
      onBuy={() => checkout.preview(selected, checkoutFields())}
    />
  );

  return (
    <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6">
      <div className="-mx-4 min-w-0 grow lg:mx-0">
        {hasTop ? (
          <div className="rounded-t-lg bg-white px-4 pt-4 lg:rounded-tr-lg lg:px-6">
            {hasNotice ? <ShopTopupNotice title={noticeTitle} body={noticeBody} /> : null}
            {showDevices ? (
              <GamePassRegionChips
                label={deviceHeading}
                hint=""
                options={devices.map((item) => ({ value: item.key, label: item.label }))}
                defaultRegion={devices[0].key}
                value={device}
                onChange={(next) => {
                  setDevice(next);
                }}
                inlineMobile
                scrollMobile
                bare
                className={`px-0 pb-4 ${hasNotice ? "pt-3" : "pt-0"}`}
              />
            ) : null}
            {showServers ? (
              <GamePassRegionChips
                label={TOPUP_SHOP_CHROME.server}
                hint=""
                regions={regions}
                defaultRegion={regions[0]}
                value={region}
                onChange={(next) => {
                  setRegion(next);
                  setSelectedKey(null);
                }}
                inlineMobile
                scrollMobile
                bare
                className={`px-0 pb-4 ${hasNotice ? "pt-3" : "pt-0"}`}
              />
            ) : null}
            {!showDevices && !showServers ? <div className="pb-4" /> : null}
          </div>
        ) : null}
        <ShopAmountCards
          variants={variants}
          selectedKey={selectedKey}
          onSelect={(variant) => {
            setSelectedKey(variant.key);
          }}
          amountLabel={`${TOPUP_SHOP_CHROME.amount}:`}
          popularLabel={FA.popular}
          attached={hasTop}
          empty={<ShopNoResults title={FA.nothingFound} text={FA.nothingFoundHint} />}
          footer={
            <p aria-label="Prices disclaimer" className="text-[14px] leading-[19.6px] text-graytext">
              {TOPUP_SHOP_CHROME.disclaimer}
            </p>
          }
        />
      </div>
      <aside className="mt-6 w-full shrink-0 basis-[400px] lg:mt-0">{offer}</aside>
    </div>
  );
}
