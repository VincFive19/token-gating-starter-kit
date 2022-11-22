import { AlertState } from "../common/utils";
import { MintButton } from "../components/MintButton";
import { ProgramState, isWhitelisted, mintOneToken } from "../common/primer";
import { PublicKey } from "@solana/web3.js";
import { WalletModalButton } from "@solana/wallet-adapter-react-ui";
import { useCallback, useEffect, useState } from "react";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";

export const MainButton = ({
  config,
  setAlertState,
  setUserHasMinted,
}: {
  config: ProgramState;
  setAlertState: (alertState: AlertState) => void;
  setUserHasMinted: (userHasMinted: boolean) => void;
}) => {
  const [hasAlreadyMinted, setHasAlreadyMinted] = useState(false);

  const [isUserMinting, setIsUserMinting] = useState(false);

  const [isUserWhitelisted, setIsUserWhitelisted] = useState(true);

  const wallet = useAnchorWallet();

  const { connection } = useConnection();

  const onMint = useCallback(async () => {
    if (wallet && config) {
      await mintOneToken(
        connection,
        wallet,
        setAlertState,
        setIsUserMinting,
        setUserHasMinted,
        setHasAlreadyMinted,
        config
      );
    }
  }, [wallet, config, connection, setAlertState, setUserHasMinted]);

  const wlKey = config.stages[0]?.white_list;

  useEffect(() => {
    if (!wallet || !wlKey) {
      return;
    }

    isWhitelisted(connection, new PublicKey(wlKey), wallet.publicKey)
      .then(setIsUserWhitelisted)
      .catch(console.error);
  }, [connection, wlKey, wallet]);

  useEffect(() => {
    wallet;
    setHasAlreadyMinted(false);
  }, [wallet]);

  const now = Math.floor(Date.now() / 1000);

  if (config.end_time && now > config.end_time) {
    return (
      <button
        disabled
        className="select-none absolute text-okb-aero-blue font-cheddar tracking-[0.025em] text-[15px] lg:text-[21px] w-[122.5px] lg:w-[205px] h-[25px] lg:h-[42px] left-[239px] lg:left-[394px] top-[151.5px] lg:top-[251px] flex justify-center items-center"
      >
        <div className="h-full lg:h-[82%]">mint complete</div>
        <svg className="w-full h-full absolute -z-10">
          <use href="#mint-sold-out" />
        </svg>
      </button>
    );
  }

  if (config.isSoldOut) {
    return (
      <button
        disabled
        className="select-none absolute text-okb-aero-blue font-cheddar tracking-[0.025em] text-[15px] lg:text-[21px] w-[122.5px] lg:w-[205px] h-[25px] lg:h-[42px] left-[239px] lg:left-[394px] top-[151.5px] lg:top-[251px] flex justify-center items-center"
      >
        <div className="h-full lg:h-[82%]">sold out</div>
        <svg className="w-full h-full absolute -z-10">
          <use href="#mint-sold-out" />
        </svg>
      </button>
    );
  }

  if (!wallet) {
    return (
      <WalletModalButton className="group select-none absolute text-okb-white active:text-okb-baltic-sea font-cheddar tracking-[0.025em] text-[15px] lg:text-[21px] w-[122.5px] lg:w-[204.5px] h-[27.5px] active:h-[25px] lg:h-[46px] lg:active:h-[42px] left-[239px] lg:left-[394px] top-[149px] active:top-[151.5px] lg:top-[247px] lg:active:top-[251px] flex justify-center items-center">
        <div className="h-full lg:h-[82%]">connect wallet</div>
        <svg className="group-active:hidden hoverful:group-hover:hidden w-full h-full absolute -z-10">
          <use href="#connect-unpressed" />
        </svg>
        <svg className="hidden group-active:hidden hoverful:group-hover:flex w-full h-full absolute -z-10">
          <use href="#connect-unpressed-hover" />
        </svg>
        <svg className="hidden group-active:flex w-full h-full absolute -z-10">
          <use href="#connect-pressed" />
        </svg>
      </WalletModalButton>
    );
  }

  if (!isUserWhitelisted) {
    return (
      <button
        disabled
        className="select-none absolute text-okb-oregon font-cheddar tracking-[0.025em] text-[15px] lg:text-[21px] w-[122.5px] lg:w-[204.5px] h-[25px] lg:h-[42px] left-[239px] lg:left-[394px] top-[151.5px] lg:top-[251px] flex justify-center items-center"
      >
        <div className="h-full lg:h-[82%]">not on drop list</div>
        <svg className="w-full h-full absolute -z-10">
          <use href="#mint-not-on-droplist" />
        </svg>
      </button>
    );
  }

  if (hasAlreadyMinted) {
    return (
      <button
        disabled
        className="select-none absolute text-okb-aero-blue font-cheddar tracking-[0.025em] text-[15px] lg:text-[21px] w-[122.5px] lg:w-[205px] h-[25px] lg:h-[42px] left-[239px] lg:left-[394px] top-[151.5px] lg:top-[251px] flex justify-center items-center"
      >
        <div className="h-full lg:h-[82%]">boombox minted</div>
        <svg className="w-full h-full absolute -z-10">
          <use href="#mint-sold-out" />
        </svg>
      </button>
    );
  }

  if (!config.isActive) {
    return (
      <button
        disabled
        className="select-none absolute text-okb-california font-cheddar tracking-[0.025em] text-[15px] lg:text-[21px] w-[122.5px] lg:w-[204.5px] h-[25px] lg:h-[42px] left-[239px] lg:left-[394px] top-[151.5px] lg:top-[251px] flex justify-center items-center"
      >
        <div className="h-full lg:h-[82%]">mint starts soon</div>
        <svg className="w-full h-full absolute -z-10">
          <use href="#mint-starts-soon" />
        </svg>
      </button>
    );
  }

  return (
    <MintButton
      config={config}
      isMinting={isUserMinting}
      onMint={onMint}
      canMint={true}
    />
  );
};
