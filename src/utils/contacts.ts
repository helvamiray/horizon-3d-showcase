export const VEGA_CONTACTS = {
  instagram: "vega.enerji",
  linkedin: "vegaenerji",
  email: "mirayhelva15@icloud.com",
  phone: "+90 212 000 00 00",
  address: "Şişli, İstanbul",
  mapsQuery: "Vega İklimlendirme Şişli İstanbul",
};

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

export function openInstagram(): void {
  const { instagram } = VEGA_CONTACTS;
  if (isMobileDevice()) {
    const appUrl = `instagram://user?username=${instagram}`;
    const webUrl = `https://www.instagram.com/${instagram}`;
    const fallback = setTimeout(() => window.open(webUrl, "_blank"), 1500);
    window.location.href = appUrl;
    window.addEventListener("blur", () => clearTimeout(fallback), {
      once: true,
    });
  } else {
    window.open(
      `https://www.instagram.com/${instagram}`,
      "_blank",
      "noopener,noreferrer"
    );
  }
}

export function openLinkedIn(): void {
  const { linkedin } = VEGA_CONTACTS;
  if (isMobileDevice()) {
    const appUrl = `linkedin://company/${linkedin}`;
    const webUrl = `https://www.linkedin.com/company/${linkedin}`;
    const fallback = setTimeout(() => window.open(webUrl, "_blank"), 1500);
    window.location.href = appUrl;
    window.addEventListener("blur", () => clearTimeout(fallback), {
      once: true,
    });
  } else {
    window.open(
      `https://www.linkedin.com/company/${linkedin}`,
      "_blank",
      "noopener,noreferrer"
    );
  }
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
