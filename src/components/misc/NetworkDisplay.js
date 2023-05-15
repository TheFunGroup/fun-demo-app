import Image from "next/image";


export default function NetworkDisplay(props) {
    const { img, name, size, classes } = props;
    return (
        <div className={`w-full flex items-center justify-between text-base text-text-200 ${classes}` }>
            <Image src={img} width={size} height={size} alt={name} />
            <div className=" ">{name}</div>
        </div>
    )
}