export const VEGA_CONTACTS = {
  instagram: "vega.enerji",
  linkedin: "vegaiklimlendirme",
  email: "mirayhelva15@icloud.com",
  phone: "+90 212 000 00 00",
  address: "Şişli, İstanbul",
  mapsQuery: "Vega İklimlendirme Şişli İstanbul",
};

/** HTTPS-only links — use these in `<a href>` or `openHttpsInTab` (reliable on iOS Safari). */
export const VEGA_SOCIAL_HREF = {
  instagram: `https://www.instagram.com/${VEGA_CONTACTS.instagram}/`,
  linkedin: `https://www.linkedin.com/company/${VEGA_CONTACTS.linkedin}/`,
} as const;

function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
  );
}

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad/i.test(navigator.userAgent);
}

/**
 * Opens an https URL in a new tab, or same tab if the mobile browser blocks popups.
 * Avoids custom schemes (`instagram://`, `linkedin://`) — Safari often reports them as invalid.
 */
function openHttpsInTab(url: string): void {
  const win = window.open(url, "_blank", "noopener,noreferrer");
  if (win == null) {
    window.location.assign(url);
  }
}

export function openInstagram(): void {
  openHttpsInTab(VEGA_SOCIAL_HREF.instagram);
}

export function openLinkedIn(): void {
  openHttpsInTab(VEGA_SOCIAL_HREF.linkedin);
}

export function openMaps(): void {
  const { mapsQuery, address } = VEGA_CONTACTS;
  const encoded = encodeURIComponent(mapsQuery);
  if (isIOS()) {
    window.location.href = `maps://maps.apple.com/?q=${encoded}`;
    setTimeout(() => {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encoded}`,
        "_blank"
      );
    }, 1000);
  } else if (isMobileDevice()) {
    window.location.href = `geo:0,0?q=${encoded}`;
    setTimeout(() => {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encoded}`,
        "_blank"
      );
    }, 1000);
  } else {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        address
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  }
}
