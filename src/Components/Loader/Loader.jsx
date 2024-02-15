import { ThreeDots } from "react-loader-spinner";
import './Loader.css';

const Loader = () => {
    return (
        <div className="d-flex justify-content-center align-items-center loaderArea ">
            <ThreeDots
                visible={true}
                height={100}
                width={100}
                radius={9}
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClassName="dna-wrapper"
                color="#0C6C0C"
            />
        </div>
    );
};

export default Loader;
