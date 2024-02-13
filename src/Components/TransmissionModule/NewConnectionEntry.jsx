import { useState } from 'react';

const NewConnectionEntry = () => {
    const [formData, setFormData] = useState({
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // api code will be set here

        console.log('Form submitted:', formData);
    };

    return (
        <div className="container">
            <div className=" col-xl-6 col-lg-8 col-11 mx-auto my-4">
                <h2 className=' text-success fw-bold text-center'>New Connection Entry</h2>
                <form onSubmit={handleSubmit}>
                    <div className=' row gap-1'>
                        <div className="form-floating col mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="district"
                                name="district"
                                value={formData.district}
                                onChange={handleChange}
                                placeholder='Enter Distict name'
                            />
                            <label htmlFor="district" className=' ms-1'>District</label>
                        </div>

                        <div className=" form-floating col mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="thana"
                                name="thana"
                                value={formData.thana}
                                onChange={handleChange}
                                placeholder='Enter thana name'
                            />
                            <label htmlFor="thana" className="form-label ms-1">Thana</label>
                        </div>
                    </div>
                    <div className=' row gap-1'>
                        <div className=" form-floating col mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="union"
                                name="union"
                                value={formData.union}
                                onChange={handleChange}
                                placeholder='Enter Union name'
                            />
                            <label htmlFor="union" className="form-label ms-1">Union</label>
                        </div>

                        <div className=" form-floating col mb-3">
                            <input
                                type="text"
                                className="form-control"
                                id="village"
                                name="village"
                                value={formData.village}
                                onChange={handleChange}
                                placeholder='Enter Union name'
                            />
                            <label htmlFor="village" className="form-label ms-1">Village</label>
                        </div>
                    </div>

                    <div className="form-floating mb-3">
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

                    <div className=' row gap-1'>
                        <div className=" form-floating col mb-3">
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
                        <div className="form-floating col mb-3">
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

                    <div className=" form-floating mb-3">
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

                    <div className=" form-floating  mb-3">
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

                    <button type="submit" className="btn btn-primary w-100 fw-bold">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default NewConnectionEntry;