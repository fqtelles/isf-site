"use client";
import { useState } from "react";
import dynamic from "next/dynamic";

const QuoteModal = dynamic(() => import("./QuoteModal"), { ssr: false });

export default function LazyQuoteModal({
  label = "Solicitar Orçamento",
  buttonStyle = {},
  buttonClass = "",
  ...modalProps
}) {
  const [shouldLoad, setShouldLoad] = useState(false);

  if (shouldLoad) {
    return (
      <QuoteModal
        {...modalProps}
        label={label}
        buttonStyle={buttonStyle}
        buttonClass={buttonClass}
        hideTrigger
        startOpen
        onAfterClose={() => setShouldLoad(false)}
      />
    );
  }

  return (
    <button
      onClick={() => setShouldLoad(true)}
      className={buttonClass}
      style={{
        display: "inline-block",
        background: "#126798",
        color: "#fff",
        padding: "12px 24px",
        borderRadius: 9999,
        fontWeight: 600,
        fontSize: "0.88rem",
        border: "none",
        cursor: "pointer",
        fontFamily: "inherit",
        ...buttonStyle,
      }}
    >
      {label}
    </button>
  );
}
