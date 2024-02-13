import { useState } from "react";

const NewConnection = () => {

    const [searchData, setSearchData] = useState(null);
    const [estimatedDistance, setEstimatedDistance] = useState(null);
    const [estimatedCost, setEstimatedCost] = useState(null);
    const handleSubmit = (event) => {
        event.preventDefault();

        const form = event.target;
        const division = form.division.value;
        const district = form.district.value;
        const thana = form.thana.value;
        const union = form.union.value;
        const village = form.village.value;
        const holding = form.holding.value;
        const direction = form.direction.value;
        const address = form.address.value;

        const searchData = {
            division, district, thana, union, village, holding, direction, address
        }
        setSearchData(searchData);
    };




    return (
        <div className="">
            <div className='formArea col-xl-6 col-lg-8 mx-auto '>

                <div className='addreddBG p-3'>
                    <h3 className=' fw-bold text-primary'>Add New Conncetion</h3>
                    <form onSubmit={handleSubmit}>
                        {/* <form> */}
                        <div className='row g-3 mb-2'>
                            <div className='col'>
                                <label htmlFor="division" className="form-label mb-0">Division:</label>
                                <input
                                    type="text"
                                    className="form-control mt-0"
                                    id="division"
                                    name="division"
                                    aria-describedby="division"
                                    // value={division}
                                    // onChange={(e) => setDivision(e.target.value)}
                                    onChange={(e) => setSearchData({ ...searchData, division: e.target.value })}

                                />
                            </div>
                            <div className='col'>
                                <label htmlFor="district" className="form-label mb-0">District:</label>
                                <input
                                    type="text"
                                    className="form-control mt-0"
                                    id="district"
                                    name="district"
                                    aria-describedby="district"
                                    // value={district}
                                    // onChange={(e) => setDistrict(e.target.value)}
                                    onChange={(e) => setSearchData({ ...searchData, district: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className='row g-3 mb-2'>
                            <div className='col'>
                                <label htmlFor="thana" className="form-label mb-0">SubDistrict/Thana:</label>
                                <input
                                    type="text"
                                    className="form-control mt-0"
                                    id="thana"
                                    name="thana"
                                    aria-describedby="thana"
                                    // value={thana}
                                    // onChange={(e) => setThana(e.target.value)}
                                    onChange={(e) => setSearchData({ ...searchData, thana: e.target.value })}
                                />
                            </div>
                            <div className='col'>
                                <label htmlFor="union" className="form-label mb-0">CityCorporation/Union:</label>
                                <input
                                    type="text"
                                    className="form-control mt-0"
                                    id="union"
                                    name="union"
                                    aria-describedby="union"
                                    // value={union}
                                    // onChange={(e) => setUnion(e.target.value)}
                                    onChange={(e) => setSearchData({ ...searchData, union: e.target.value })}
                                />
                            </div>


                        </div>

                        <div className='row g-3 mb-2'>
                            <div className='col'>
                                <label htmlFor="village" className="form-label mb-0">Village/WordNo:</label>
                                <input
                                    type="text"
                                    className="form-control mt-0"
                                    id="village"
                                    name="village"
                                    aria-describedby="village"
                                    // value={village}
                                    // onChange={(e) => setVillage(e.target.value)}
                                    onChange={(e) => setSearchData({ ...searchData, village: e.target.value })}
                                />
                            </div>
                            <div className='col'>
                                <label htmlFor="holding" className="form-label mb-0">HoldingNo:</label>
                                <input
                                    type="text"
                                    className="form-control mt-0"
                                    id="holding"
                                    name="holding"
                                    aria-describedby="holding"
                                    // value={holding}
                                    // onChange={(e) => setHolding(e.target.value)}
                                    onChange={(e) => setSearchData({ ...searchData, holding: e.target.value })}
                                />
                            </div>
                        </div>


                        <div className='col mb-2'>
                            <label htmlFor="direction" className="form-label mb-0">Direction:</label>
                            <input
                                type="text"
                                className="form-control mt-0"
                                id="direction"
                                name="direction"
                                aria-describedby="direction"
                                // value={direction}
                                // onChange={(e) => setDirection(e.target.value)}
                                onChange={(e) => setSearchData({ ...searchData, direction: e.target.value })}
                            />
                        </div>

                        <div className='col mb-2'>
                            <label htmlFor="address" className="form-label mb-0">Address:</label>
                            <input
                                type="text"
                                className="form-control mt-0"
                                id="address"
                                name="address"
                                aria-describedby="address"
                                // value={address}
                                // onChange={(e) => setAddress(e.target.value)}
                                onChange={(e) => setSearchData({ ...searchData, address: e.target.value })}
                            />
                        </div>


                        <button type="submit" className="btn btn-primary w-100">
                            Save
                        </button>
                    </form>

                    {
                        estimatedDistance &&
                        <div className=' my-4 fw-bold'>
                            <h3 className=' fw-bold text-primary'>Estimated Cost</h3>
                            <p className=' mb-0'>Distance from nearest point = {estimatedDistance} Meter </p>
                            <p className=' mt-0'>Total Cost(SetupCost + Cable ) = {estimatedCost} TK</p>
                        </div>
                    }

                </div>
            </div>
        </div>
    );
};

export default NewConnection;