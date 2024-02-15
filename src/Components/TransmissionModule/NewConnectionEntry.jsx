import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAllDivision, getAllDistrict, getAllUpazila, getAllUnion } from 'bd-divisions-to-unions';
import configUrl from '../../api/config';
import Loader from '../Loader/Loader';

// console.log(getAllDivision())
// console.log(getAllDistrict())
// console.log(getAllUpazila())
// console.log(getAllUnion())

const NewConnectionEntry = () => {

    const [formData, setFormData] = useState({
        division: '',
        district: '',
        thana: '',
        union: '',
        village: '',
        locationName: '',
        latitude: '',
        longitude: '',
        responsible: '',
        remarks: '',
    });

    const [districts, setDistricts] = useState([]);
    const [thanas, setThanas] = useState([]);
    const [unions, setUnions] = useState([]);
    const [loading, setLoading] = useState(false);

    // console.log("districts list", districts);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // select district
    useEffect(() => {
        if (formData.division !== '') {
            const divisionId = formData.division;
            const allDistricts = getAllDistrict("en");
            // console.log("All Districts:", allDistricts);
            const divisionDistricts = allDistricts[divisionId];
            // console.log("Division Districts:", divisionDistricts);
            setDistricts(divisionDistricts);
        } else {
            setDistricts([]);
        }
    }, [formData.division]);


    // select thanas
    useEffect(() => {
        if (formData.district !== '') {
            const districtId = formData.district;
            const allThana = getAllUpazila("en");
            // console.log("All Thana:", allThana);
            const districtsThanas = allThana[districtId];
            // console.log("Districts Thanas:", districtsThanas);
            setThanas(districtsThanas);
        } else {
            setThanas([]);
        }
    }, [formData.district]);


    // select unions
    useEffect(() => {
        if (formData.thana !== '') {
            const thanaId = formData.thana;
            const allUnion = getAllUnion("en");
            // console.log("All Union:", allUnion);
            const thanasUnions = allUnion[thanaId];
            // console.log("Thanas union:", thanasUnions);
            setUnions(thanasUnions);
        } else {
            setUnions([]);
        }

    }, [formData.thana]);


    fetch(`${configUrl.BASEURL}/api/v1/wificonnection`)
        .then(response => response.json())
        .then(data => {
            console.log("All Saved Connedtions: ", data.data);
        });


    //     const handleSignupDataSubmit = (event) => {
    //         setLoading(true);
    //         setErrorMessage("")
    //         event.preventDefault();

    //         setConfirmPasswordError('');
    //         if (!validatePassword(password, confirmPassword)) {
    //             setPasswordMatchError('');
    //             setPasswordPatternError("Password should be at least 8 characters long and must contain an alphabetical character and a numeric character.");
    //             setLoading(false)
    //         } else {
    //             setPasswordPatternError('');
    //             fetch(`${configUrl.BASEURL}/api/users`, {
    //                 method: 'POST',
    //                 headers: {
    //                     'content-type': 'application/json'
    //                 },
    //                 body: JSON.stringify(signUpData)
    //             })
    //                 .then(response => response.json())
    //                 .then(data => {
    //                     // console.log("Signup Data", data);
    //                     if (data?.status === 'success') {
    //                         navigate("/login");
    //                         setErrorMessage("");
    //                         setLoading(false);
    //                     }
    //                     else {
    //                         setErrorMessage(data.message)
    //                         setLoading(false);
    //                     }
    //                 })
    //                 .catch(error => {
    //                     setErrorMessage("");
    //                     setLoading(false);
    //                 })
    //         }
    //     }
    // }



    const handleSubmit = (event) => {
        setLoading(true);
        event.preventDefault();

        fetch(`${configUrl.BASEURL}/api/v1/wificonnection`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                console.log("wificonnection saved data : ", data);
                if (data.status === "success") {
                    setLoading(false);
                    toast.success("New connection successfully submitted.");
                }
                else {
                    setLoading(false);
                    console.log("Connection saved message:", data.message);
                }
            })
            .catch(error => {
                console.log("Error Occured : ", error);
                setLoading(false);
            })
    };

    if (loading) {
        return (
            <Loader></Loader>
        )
    }


    return (
        <div className="container">
            <div className=" col-xl-6 col-lg-8 col-11 mx-auto my-4">
                <h2 className=' text-success fw-bold text-center mt-5 mb-4'>New Connection Entry</h2>
                <form onSubmit={handleSubmit}>

                    <div className=' row'>
                        <div className="col mb-3">
                            <label htmlFor="division" className="form-label fw-bold ms-1">
                                Select Division
                            </label>
                            <select
                                name="division"
                                id="division"
                                className="form-select"
                                onChange={handleChange}

                            >
                                <option value="">Please Select</option>
                                {getAllDivision("en").map((item, index) => (
                                    <option key={index} value={item.value}>
                                        {item.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {districts &&
                            <div className="col mb-3">
                                <label htmlFor="districts" className="form-label fw-bold ms-1">
                                    Select District
                                </label>
                                <select
                                    name="district"
                                    id="districts"
                                    className="form-select"
                                    value={formData.district}
                                    onChange={handleChange}
                                >
                                    <option value="">Please Select</option>
                                    {districts.map((district, index) => (
                                        <option key={index} value={district.value}>
                                            {district.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        }
                    </div>

                    <div className=' row'>
                        {unions &&
                            <div className="col mb-3">
                                <label htmlFor="thana" className="form-label fw-bold ms-1">
                                    Select Thana
                                </label>
                                <select
                                    name="thana"
                                    id="thana"
                                    className="form-select"
                                    value={formData.thana}
                                    onChange={handleChange}
                                >
                                    <option value="">Please Select</option>
                                    {thanas.map((thana, index) => (
                                        <option key={index} value={thana.value}>
                                            {thana.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        }

                        {unions &&
                            <div className="col mb-3">
                                <label htmlFor="union" className="form-label fw-bold ms-1">
                                    Select Union
                                </label>
                                <select
                                    name="union"
                                    id="union"
                                    className="form-select"
                                    value={formData.union}
                                    onChange={handleChange}
                                >
                                    <option value="">Please Select</option>
                                    {unions.map((union, index) => (
                                        <option key={index} value={union.value}>
                                            {union.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        }
                    </div>

                    <div className="form-floating mb-1">
                        <input
                            type="text"
                            className="form-control"
                            id="locationName"
                            name="locationName"
                            value={formData.locationName}
                            onChange={handleChange}
                            placeholder='Enter location name'
                        />
                        <label htmlFor="locationName" className="">Location Name</label>
                    </div>

                    <div className=' row '>
                        <div className=" form-floating col mb-1">
                            <input
                                type="text"
                                className="form-control"
                                id="latitude"
                                name="latitude"
                                value={formData.latitude}
                                onChange={handleChange}
                                placeholder='Enter Latitude'
                            />
                            <label htmlFor="latitude" className="form-label ms-1">Latitude</label>
                        </div>
                        <div className="form-floating col mb-1">
                            <input
                                type="text"
                                className="form-control"
                                id="longitude"
                                name="longitude"
                                value={formData.longitude}
                                onChange={handleChange}
                                placeholder='Enter Longitude'
                            />
                            <label htmlFor="longitude" className="form-label ms-1">Langitude</label>
                        </div>
                    </div>

                    <div className=" form-floating mb-1">
                        <input
                            type="text"
                            className="form-control"
                            id="responsible"
                            name="responsible"
                            value={formData.responsible}
                            onChange={handleChange}
                            placeholder='Enter responsible person'
                        />
                        <label htmlFor="responsible" className="form-label">Responsible Person</label>
                    </div>

                    <div className=" form-floating  mb-1">
                        <textarea
                            type="text"
                            className="form-control"
                            id="remarks"
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                            maxLength={300}
                            placeholder='Enter remarks'
                        />
                        <label htmlFor="remarks" className="form-label">Remarks</label>
                    </div>

                    <button type="submit" className="btn btn-success w-100 fw-bold my-3">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default NewConnectionEntry;