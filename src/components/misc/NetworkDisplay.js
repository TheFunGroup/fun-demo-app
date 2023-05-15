import Image from "next/image";

const networks = {
  ethereum: {
    img: "/ethereum.svg",
    name: "Ethereum",
  },
  polygon: {
    img: "/polygon.svg",
    name: "Polygon",
  },
  arbitrum: {
    img: "/arbitrum.svg",
    name: "Arbitrum",
  },
};

const Tokens = {
  ETH: networks.ethereum,
  stETH: {
    img: "/steth.svg",
    name: "Lido ETH",
  },
};

// TODO normalize the padding between the img and the text
export const SingleNetworkDisplay = (props) => {
  const { img, name, size, classes } = props;
  return (
    <div
      className={`w-full flex items-center justify-start text-base text-text-200 ${classes}`}
    >
      <Image src={img} width={size} height={size} alt={name} />
      <div className="px-2">{name}</div>
    </div>
  );
};

const NetworkDisplay = (props) => {
  if (props.network)
    return (
      <SingleNetworkDisplay
        {...props}
        name={networks[props.network].name}
        img={networks[props.network].img}
      />
    );
  if (props.token)
    return (
      <SingleNetworkDisplay
        {...props}
        name={Tokens[props.token].name}
        img={Tokens[props.token].img}
      />
    );
};
export default NetworkDisplay;
