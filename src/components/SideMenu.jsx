import { useState, useEffect, useRef } from "react";
import { getSdkOptions } from "../utils/function";

function SideMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [colors, setColors] = useState({});
  const [toggles, setToggles] = useState({});
  const [sdkOptionsChanged, setSdkOptionsChanged] = useState(false);
  const styleSheetRef = useRef(null);
  const defaultSdkOptions = getSdkOptions();

  const handleOpen = () => {
    setShowButton(false);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Wait for animation to complete (0.3s transition)
    setTimeout(() => {
      setShowButton(true);
    }, 300);
  };

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  // Create or get style sheet for dynamic CSS rules
  useEffect(() => {
    let styleSheet = document.getElementById("dynamic-color-styles");
    if (!styleSheet) {
      styleSheet = document.createElement("style");
      styleSheet.id = "dynamic-color-styles";
      document.head.appendChild(styleSheet);
    }
    styleSheetRef.current = styleSheet;
    return () => {
      // Cleanup on unmount
      if (styleSheet && styleSheet.parentNode) {
        styleSheet.parentNode.removeChild(styleSheet);
      }
    };
  }, []);

  const PROPERTY_TYPE = {
    1: "background-color",
    2: "color",
  };

  // Check if both formEnable and triggerStartCall are enabled
  const checkBothTogglesEnabled = (itemIndex) => {
    const formEnableKey = `${itemIndex}-0`; // Form Enable is first subItem (index 0)
    const triggerStartCallKey = `${itemIndex}-1`; // Direct call enable is second subItem (index 1)
    return toggles[formEnableKey] && toggles[triggerStartCallKey];
  };

  const handleToggleChange = (
    itemIndex,
    subItemIndex,
    checked,
    subItem,
    itemTitle
  ) => {
    const key = `${itemIndex}-${subItemIndex}`;
    setToggles((prev) => ({
      ...prev,
      [key]: checked,
    }));

    // Check if this toggle is in the SDK options section
    if (itemTitle === "SDk options") {
      setSdkOptionsChanged(true);
    }

    // Placeholder: hook into SDK options if needed
    console.log("Toggle changed:", {
      itemIndex,
      subItemIndex,
      checked,
      subItem,
    });
  };

  const handleReloadSDK = async (sdkOptionsIndex) => {
    // Reload SDK with new options
    if (window.MirrorFlyAi) {
     await window?.MirrorFlyAi?.endCall();
      const containerId = "#ai-widget";

      const sdkOptionsItem = menuItems.find(item => item.title === "SDk options");
      if (sdkOptionsItem && sdkOptionsItem.subItems) {
        sdkOptionsItem.subItems.forEach((subItem, subIndex) => {
          if (subItem.type && subItem.action === "toggle") {
            const toggleKey = `${sdkOptionsIndex}-${subIndex}`;
            const toggleValue = toggles[toggleKey] || false;
            defaultSdkOptions[subItem.type] = toggleValue;
          }
        });
      }

      window.MirrorFlyAi.init({ container: containerId, ...defaultSdkOptions });
      setSdkOptionsChanged(false);
    }
  };

  const handleColorChange = (itemIndex, subItemIndex, color, subItem) => {
    const key = `${itemIndex}-${subItemIndex}`;
    setColors((prev) => ({
      ...prev,
      [key]: color,
    }));

    // Apply color to the element using the selector and property type
    if (subItem?.selector) {
      const propertyKey =
        PROPERTY_TYPE[subItem.type] ||
        (subItem.title.toLowerCase().includes("background")
          ? "background-color"
          : "color");

      // Apply to existing elements
      const elements = document.querySelectorAll(subItem.selector);
      elements.forEach((element) => {
        element.style.setProperty(propertyKey, color, "important");
      });

      // Inject CSS rule so dynamically added elements also get the color
      if (styleSheetRef.current && styleSheetRef.current.sheet) {
        // Find and remove existing rule for this selector and property
        const rules = Array.from(styleSheetRef.current.sheet.cssRules || []);
        const existingRuleIndex = rules.findIndex(
          (rule) =>
            rule.selectorText === subItem.selector &&
            rule.style &&
            rule.style.getPropertyValue(propertyKey)
        );

        if (existingRuleIndex !== -1) {
          styleSheetRef.current.sheet.deleteRule(existingRuleIndex);
        }

        // Add new CSS rule with !important
        try {
          styleSheetRef.current.sheet.insertRule(
            `${subItem.selector} { ${propertyKey}: ${color} !important; }`,
            styleSheetRef.current.sheet.cssRules.length
          );
        } catch {
          // Fallback: append to textContent if insertRule fails
          styleSheetRef.current.textContent += `${subItem.selector} { ${propertyKey}: ${color} !important; }\n`;
        }
      }
    }
  };

  const getColorValue = (itemIndex, subItemIndex) => {
    const key = `${itemIndex}-${subItemIndex}`;
    return colors[key] || "#000000";
  };

  const getToggleValue = (itemIndex, subItemIndex, subItem) => {
    const key = `${itemIndex}-${subItemIndex}`;
    // If user has interacted with this toggle, use that value
    if (Object.prototype.hasOwnProperty.call(toggles, key)) {
      return !!toggles[key];
    }
    // Otherwise fall back to the default status from menuItems (if provided)
    if (typeof subItem?.status === "boolean") {
      return subItem.status;
    }
    return false;
  };

  const menuItems = [
    {
      title: "Body",
      link: "#",
      subItems: [
        {
          title: "Background Color",
          link: "#",
          selector: ".mf-widget-outer",
          action: "color-picker",
        },
      ],
    },
    {
      title: "Start Call Button",
      link: "#",
      subItems: [
        {
          type: 1,
          title: "Background Color",
          link: "#",
          selector: ".start-btn",
          action: "color-picker",
        },
        {
          type: 2,
          title: "Text Color",
          link: "#",
          selector: ".start-btn",
          action: "color-picker",
        },
      ],
    },
    {
      title: "End Call Button",
      link: "#",
      subItems: [
        {
          title: "Background Color",
          link: "#",
          selector: ".mf-end-btn",
          action: "color-picker",
        },
        {
          type: 2,
          title: "Text Color",
          link: "#",
          selector: ".mf-end-btn",
          action: "color-picker",
        },
      ],
    },
    {
      title: "Agent header",
      link: "#",
      subItems: [
        {
          type: 2,
          title: "Text Color",
          link: "#",
          selector: ".agent-type",
          action: "color-picker",
        },
      ],
    },
    {
      title: "Transcription",
      link: "#",
      subItems: [
        {
          type: 2,
          title: "Text Color",
          link: "#",
          selector: ".mf-bubble",
          action: "color-picker",
        },
        {
          type: 1,
          title: "Background Color",
          link: "#",
          selector: ".mf-bubble",
          action: "color-picker",
        },
        {
          type: 2,
          title: "Header text color",
          link: "#",
          selector: ".mf-label",
          action: "color-picker",
        },
      ],
    },
    {
      title: "SDk options",
      subItems: [
        {
          title: "Form Enable",
          link: "#",
          action: "toggle",
          type: "formEnable",
          status: defaultSdkOptions?.formEnable,
        },
        {
          title: "Direct call enable",
          link: "#",
          action: "toggle",
          type: "triggerStartCall",
          status: defaultSdkOptions?.triggerStartCall,
        },
        {
          title: "Transcription enable",
          link: "#",
          action: "toggle",
          type: "transcriptionEnable",
          status: defaultSdkOptions?.transcriptionEnable,
        },
        {
          title: "chat Enable",
          link: "#",
          action: "toggle",
          type: "chatEnable",
          status: defaultSdkOptions?.chatEnable,
        }
      ],
    },
  ];

  return (
    <>
      {showButton && (
        <button
          className="nav-btn open-btn"
          onClick={handleOpen}
          style={{ zIndex: 999999 }}
        >
          <i className="fas fa-plus"></i>
        </button>
      )}

      <div className={`nav ${isOpen ? "visible" : ""}`}>
        <button className="nav-btn close-btn" onClick={handleClose}>
          <i className="fas fa-times"></i>
        </button>

        <ul className="accordion-list">
          {menuItems.map((item, index) => (
            <li key={index} className="accordion-item">
              <button
                className="accordion-header"
                onClick={() => toggleAccordion(index)}
              >
                <span>{item.title}</span>
                <div className="accordion-header-right">
                  {item.title === "SDk options" && checkBothTogglesEnabled(index) && (
                    <div className="error-icon-wrapper">
                      <i className="fas fa-exclamation-circle error-icon"></i>
                      <span className="error-tooltip">Choose any one form or direct trigger</span>
                    </div>
                  )}
                  {item.title === "SDk options" && sdkOptionsChanged && !checkBothTogglesEnabled(index) && (
                    <button
                      className="reload-icon-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReloadSDK(index);
                      }}
                      title="Reload SDK with new options"
                    >
                      <i className="fas fa-sync-alt"></i>
                    </button>
                  )}
                  <i
                    className={`fas fa-chevron-${
                      openAccordion === index ? "up" : "down"
                    }`}
                  ></i>
                </div>
              </button>
              <div
                className={`accordion-content ${
                  openAccordion === index ? "open" : ""
                }`}
              >
                {item.subItems ? (
                  <ul className="accordion-sub-list">
                    {item.subItems.map((subItem, subIndex) => (
                      <li key={subIndex} className="color-picker-item">
                        {subItem.action === "color-picker" && (
                          <label className="color-picker-label">
                            <span>{subItem.title}</span>
                            <div className="color-picker-wrapper">
                              <input
                                type="color"
                                value={getColorValue(index, subIndex)}
                                onChange={(e) =>
                                  handleColorChange(
                                    index,
                                    subIndex,
                                    e.target.value,
                                    subItem
                                  )
                                }
                                className="color-picker-input"
                              />
                              <span className="color-value">
                                {getColorValue(index, subIndex)}
                              </span>
                            </div>
                          </label>
                        )}

                        {subItem.action === "toggle" && (
                          <label className="color-picker-label">
                            <span>{subItem.title}</span>
                            <div className="sdk-toggle-wrapper">
                              <label className="switch sdk-toggle-switch">
                                <input
                                  type="checkbox"
                                  checked={getToggleValue(index, subIndex, subItem)}
                                  onChange={(e) =>
                                    handleToggleChange(
                                      index,
                                      subIndex,
                                      e.target.checked,
                                      subItem,
                                      item.title
                                    )
                                  }
                                />
                                <span className="slider"></span>
                              </label>
                            </div>
                          </label>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="accordion-single-content">
                    <a href={item.link}>{item.title}</a>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default SideMenu;
