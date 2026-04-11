import { useEffect, useState } from "react";

export function useTypewriter(text, typingSpeed = 100, pause = 1500) {
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let timeout;

    if (!deleting && displayed.length < text.length) {
      // on tape
      timeout = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1));
      }, typingSpeed);
    } else if (!deleting && displayed.length === text.length) {
      // pause avant effacement
      timeout = setTimeout(() => {
        setDeleting(true);
      }, pause);
    } else if (deleting && displayed.length > 0) {
      // on efface
      timeout = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length - 1));
      }, typingSpeed / 2);
    } else if (deleting && displayed.length === 0) {
      // on recommence à taper
      setDeleting(false);
    }

    return () => clearTimeout(timeout);
  }, [text, displayed, deleting, typingSpeed, pause]);

  return displayed;
}
