import './Home.css';
import BannerImg from "../../assets/homeImage/heroSmart-bangladesh-prize.png";

const Home = () => {
    return (
        <div>
            <div className="container my-5">
                <div className="row px-4 pb-0 pe-lg-0   align-items-center rounded-3 border shadow-lg">
                    <div className="col-lg-6 p-3    ">
                        <h1 className="display-3 fw-bold lh-1 text-body-emphasis">ShadhinWifi Connection Transmission Module</h1>
                        <p className="lead">Quickly design and customize responsive mobile-first sites with Bootstrap, the world’s most popular front-end open source toolkit, featuring Sass variables and mixins, responsive grid system, extensive prebuilt components, and powerful JavaScript plugins.</p>
                        <div className="d-grid gap-2 d-md-flex justify-content-md-start mb-4 mb-lg-3">
                            <button type="button" className="btn btn-primary btn-lg px-4 me-md-2 fw-bold">Primary</button>
                            <button type="button" className="btn btn-outline-secondary btn-lg px-4">Default</button>
                        </div>
                    </div>
                    <div className="col-lg-6   p-0 overflow-hidden shadow-lg">
                        <img className="rounded-lg-3 mt-0 pt-0" src={BannerImg} alt="Banner-Image" width="720" height="100%" />
                    </div>
                </div>
            </div>

            <div className="px-4 pt-5 my-5 text-center border-bottom">
                <h1 className="display-4 fw-bold text-body-emphasis">ShadhinWifi Connection</h1>
                <div className="col-lg-6 mx-auto">
                    <p className="lead mb-4">Quickly design and customize responsive mobile-first sites with Bootstrap, the world’s most popular front-end open source toolkit, featuring Sass variables and mixins, responsive grid system, extensive prebuilt components, and powerful JavaScript plugins.</p>
                    <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mb-5">
                        <button type="button" className="btn btn-primary btn-lg px-4 me-sm-3">Primary button</button>
                        <button type="button" className="btn btn-outline-secondary btn-lg px-4">Secondary</button>
                    </div>
                </div>
                <div className="overflow-hidden" style={{ maxHeight: "65vh" }}>
                    <div className="container px-5">
                        <img src={BannerImg} className="img-fluid border rounded-3 shadow-lg mb-4" alt="Example image" width="700" height="500" loading="lazy" />
                    </div>
                </div>
            </div>

            <div className="container col-xl-10  px-4 py-5">
                <div className="row align-items-center g-lg-5 py-5">
                    <div className="col-lg-7 text-center text-lg-start">
                        <h1 className="display-4 fw-bold lh-1 text-body-emphasis mb-3">Transmission Module User Sign-up Form</h1>
                        <p className="col-lg-10 fs-4">Below is an example form built entirely with Bootstrap’s form controls. Each required form group has a validation state that can be triggered by attempting to submit the form without completing it.</p>
                    </div>
                    <div className="col-md-10 mx-auto col-lg-5">
                        <form className="p-4 p-md-5 border rounded-3 bg-body-tertiary">
                            <div className="form-floating mb-3">
                                <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
                                <label htmlFor="floatingInput">Email address</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="password" className="form-control" id="floatingPassword" placeholder="Password" />
                                <label htmlFor="floatingPassword">Password</label>
                            </div>
                            <div className="checkbox mb-3">
                                <label>
                                    <input type="checkbox" value="remember-me" /> Remember me
                                </label>
                            </div>
                            <button className="w-100 btn btn-lg btn-primary" type="submit">Sign up</button>
                            <hr className="my-4" />
                            <small className="text-body-secondary">By clicking Sign up, you agree to the terms of use.</small>
                        </form>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default Home;