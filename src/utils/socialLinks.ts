interface SocialLinkConfig {
  instagramUsername: string;
  linkedinCompanySlug: string;
}

const config: SocialLinkConfig = {
  instagramUsername: "vega.enerji",
  linkedinCompanySlug: "vegaenerji",
};

function isMobileDevice(): boolean {
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
  );
}

export function openInstagram(): void {
  if (isMobileDevice()) {
    const appUrl = `instagram://user?username=${config.instagramUsername}`;
    const webUrl = `https://www.instagram.com/${config.instagramUsername}`;
    const fallbackTimer = setTimeout(() => {
      window.open(webUrl, "_blank");
    }, 1500);
    window.location.href = appUrl;
    window.addEventListener("blur", () => clearTimeout(fallbackTimer), {
      once: true,
    });
  } else {
    window.open(
      `https://www.instagram.com/${config.instagramUsername}`,
      "_blank",
      "noopener,noreferrer"
    );
  }
}

export function openLinkedIn(): void {
  if (isMobileDevice()) {
    const appUrl = `linkedin://company/${config.linkedinCompanySlug}`;
    const webUrl = `https://www.linkedin.com/company/${config.linkedinCompanySlug}`;
    const fallbackTimer = setTimeout(() => {
      window.open(webUrl, "_blank");
    }, 1500);
    window.location.href = appUrl;
    window.addEventListener("blur", () => clearTimeout(fallbackTimer), {
      once: true,
    });
  } else {
    window.open(
      `https://www.linkedin.com/company/${config.linkedinCompanySlug}`,
      "_blank",
      "noopener,noreferrer"
    );
  }
}
