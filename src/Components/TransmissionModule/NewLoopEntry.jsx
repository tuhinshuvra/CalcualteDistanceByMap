import { useState } from 'react';

const NewLoopEntry = () => {
    const [formData, setFormData] = useState({
        district: '',
        thana: '',
        union: '',
        village: '',
        locationName: '',
        latlan: '',
        wireAmount: '',
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
                <h2 className=' text-success fw-bold text-center'>New Loop Entry</h2>
                <form onSubmit={handleSubmit}>
                    <div className=' row gap-1'>
                        <div className="col mb-3">
                            <label htmlFor="district" className="form-label">District</label>
                            <input
                                type="text"
                                className="form-control"
                                id="district"
                                name="district"
                                value={formData.district}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col mb-3">
                            <label htmlFor="thana" className="form-label">Thana</label>
                            <input
                                type="text"
                                className="form-control"
                                id="thana"
                                name="thana"
                                value={formData.thana}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className=' row gap-1'>
                        <div className="col mb-3">
                            <label htmlFor="union" className="form-label">Union</label>
                            <input
                                type="text"
                                className="form-control"
                                id="union"
                                name="union"
                                value={formData.union}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col mb-3">
                            <label htmlFor="village" className="form-label">Village</label>
                            <input
                                type="text"
                                className="form-control"
                                id="village"
                                name="village"
                                value={formData.village}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="locationName" className="form-label">Location Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="locationName"
                            name="locationName"
                            value={formData.locationName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="latlan" className="form-label">Latitude and Lagitude</label>
                        <input
                            type="text"
                            className="form-control"
                            id="latlan"
                            name="latlan"
                            value={formData.latlan}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="wireAmount" className="form-label">WireAmount</label>
                        <input
                            type="wireAmount"
                            className="form-control"
                            id="wireAmount"
                            name="wireAmount"
                            value={formData.wireAmount}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 fw-bold">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default NewLoopEntry;