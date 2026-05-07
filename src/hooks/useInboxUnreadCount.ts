import { useEffect, useState } from "react";
import { contactService } from "@/lib/contactService";

export function useInboxUnreadCount(): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => {
      if (typeof window === "undefined") return;
      setCount(contactService.getUnreadCount());
    };
    update();
    window.addEventListener("storage", update);
    window.addEventListener("vega-contact-inbox-updated", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("vega-contact-inbox-updated", update);
    };
  }, []);

  return count;
}
