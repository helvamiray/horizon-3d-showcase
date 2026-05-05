interface OfficeLocation {
  name: string;
  address: string;
  lat: number;
  lng: number;
  placeId?: string;
}

const VEGA_OFFICE: OfficeLocation = {
  name: "Vega Enerji Mühendislik",
  address: "Dudullu Organize Sanayi Bölgesi, İstanbul",
  lat: 41.028,
  lng: 29.17,
};

function isMobile(): boolean {
  return /Android|iPhone|iPad/i.test(navigator.userAgent);
}

function isIOS(): boolean {
  return /iPhone|iPad/i.test(navigator.userAgent);
}

export function openDirections(location: OfficeLocation = VEGA_OFFICE): void {
  const encodedQuery = encodeURIComponent(
    `${location.name} ${location.address}`
  );

  if (isIOS()) {
    window.location.href = `maps://maps.apple.com/?daddr=${location.lat},${location.lng}&dirflg=d`;
    setTimeout(() => {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`,
        "_blank"
      );
    }, 1000);
  } else if (isMobile()) {
    window.location.href = `google.navigation:q=${location.lat},${location.lng}`;
    setTimeout(() => {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`,
        "_blank"
      );
    }, 1000);
  } else {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`,
      "_blank",
      "noopener,noreferrer"
    );
  }
}

export { VEGA_OFFICE };
