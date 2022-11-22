import { useWallet } from "@solana/wallet-adapter-react";
import { WalletIcon, useWalletModal } from "@solana/wallet-adapter-react-ui";
import type { FC, PropsWithChildren } from "react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export const WalletButton: FC<PropsWithChildren<{}>> = ({
  children,
  ...props
}) => {
  const { connected, publicKey, wallet, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [copied, setCopied] = useState(false);
  const [active, setActive] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey]);
  const content = useMemo(() => {
    if (children) return children;
    if (!wallet || !base58) return null;
    return base58.slice(0, 8) + ".." + base58.slice(-8);
  }, [children, wallet, base58]);

  const copyAddress = useCallback(async () => {
    if (base58) {
      await navigator.clipboard?.writeText(base58);
      setCopied(true);
      setTimeout(() => setCopied(false), 400);
    }
  }, [base58]);

  const toggleDropdown = useCallback(
    () => setActive(active !== true),
    [active]
  );

  const openDropdown = useCallback(() => setActive(true), []);

  const closeDropdown = useCallback(() => setActive(false), []);

  const openModal = useCallback(() => {
    setVisible(true);
    closeDropdown();
  }, [setVisible, closeDropdown]);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [dropdownRef, closeDropdown]);

  if (!connected) {
    return (
      <div className="hidden lg:flex select-none left-[413px] top-[516px] h-[26px] w-[167px] justify-center items-center font-medium absolute uppercase text-okb-baltic-sea text-[10.5px] tracking-[0.1em]">
        <div className="h-[75%]">wallet not connected</div>
        <svg className="w-full h-full absolute -z-10">
          <use href="#wallet-not-connected" />
        </svg>
      </div>
    );
  }

  return (
    <div
      ref={dropdownRef}
      className="hidden lg:flex absolute left-[413px] top-[512px] tracking-[0.1em] font-medium absolute text-[10.5px] font-outfit uppercase flex-col"
    >
      <button
        aria-expanded={active}
        className={`group justify-center items-center flex z-20 ${
          active
            ? "h-[24px] w-[167px] mt-[3px] text-okb-heliotrope"
            : "h-[30px] w-[167px] text-okb-citrine-white active:h-[27px] active:mt-[3px] active:text-okb-heliotrope"
        } `}
        onClick={toggleDropdown}
        {...props}
      >
        <div className="h-[77%]">{content}</div>
        {active ? (
          <svg className="w-full h-full absolute -z-10">
            <use href="#wallet-pressed-shadowless" />
          </svg>
        ) : (
          <>
            <svg className="group-active:hidden hoverful:group-hover:hidden w-full h-full absolute -z-10">
              <use href="#wallet-unpressed" />
            </svg>
            <svg className="hidden group-active:hidden hoverful:group-hover:flex w-full h-full absolute -z-10">
              <use href="#wallet-unpressed-hover" />
            </svg>
            <svg className="hidden group-active:flex w-full h-full absolute -z-10">
              <use href="#wallet-pressed" />
            </svg>
          </>
        )}
      </button>
      <ul
        aria-label="dropdown-list"
        className={`shadow-[0px_2px_0px_1px_rgba(207,202,209,0.4)] z-10 absolute top-[3px] left-px right-px list-none bg-black rounded pt-[22px] pb-0.5 transition-all ${
          active
            ? "opacity-100 visible scale-100"
            : "opacity-0 invisible scale-75"
        }`}
        role="menu"
      >
        <li
          onClick={copyAddress}
          className="group text-okb-baltic-sea flex items-center justify-center h-[23px] w-[166px] cursor-pointer"
          role="menuitem"
        >
          {copied ? "copied" : "copy"}
          <svg className="w-full h-full absolute -z-10">
            <use className="hoverful:group-hover:hidden" href="#wallet-copy" />
            <use
              className="hidden hoverful:group-hover:flex"
              href="#wallet-copy-hover"
            />
          </svg>
        </li>
        <li
          onClick={openModal}
          className="group text-okb-baltic-sea flex items-center justify-center h-[23px] w-[166px] cursor-pointer"
          role="menuitem"
        >
          change
          <svg className="w-full h-full absolute -z-10">
            <use className="hoverful:group-hover:hidden" href="#wallet-copy" />
            <use
              className="hidden hoverful:group-hover:flex"
              href="#wallet-copy-hover"
            />
          </svg>
        </li>
        <li
          onClick={disconnect}
          className="group text-okb-baltic-sea flex items-center justify-center h-[23px] w-[166px] cursor-pointer"
          role="menuitem"
        >
          disconnect wallet
          <svg className="w-full h-full absolute -z-10">
            <use
              className="hoverful:group-hover:hidden"
              href="#wallet-disconnect"
            />
            <use
              className="hidden hoverful:group-hover:flex"
              href="#wallet-disconnect-hover"
            />
          </svg>
        </li>
      </ul>
    </div>
  );
};
