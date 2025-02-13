import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faCog, faShieldAlt } from "@fortawesome/free-solid-svg-icons";

const FeatureCard = (props) => {
    return (
        <div className="card text-center p-4 shadow-sm bg-dark text-white rounded-3">
            <div className="card-body">
                <FontAwesomeIcon
                    icon={props.icon}
                    size="2x"
                    className="mb-3 text-primary"
                />
                <h5 className="fw-bold">{props.title}</h5>
                <p className="text-muted">{props.description}</p>
            </div>
        </div>
    );
};

FeatureCard.propTypes = {
    icon: PropTypes.any.isRequired, // FontAwesome icon es un objeto
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};

const AboutFeatures = () => {
    const features = [
        {
            icon: faGlobe,
            title: "Experiencias Auténticas",
            description:
                "Descubre el mundo a través de los ojos de quienes lo llaman hogar. Conecta con guías locales y vive aventuras genuinas.",
        },
        {
            icon: faCog,
            title: "Flexibilidad y Personalización",
            description:
                "Aventuras diseñadas a tu ritmo y según tus necesidades. Todo, con la libertad de personalizar cada detalle.",
        },
        {
            icon: faShieldAlt,
            title: "Comunidad Segura",
            description:
                "Opiniones verificadas y Rangers confiables para que viajes con tranquilidad.",
        },
    ];

    return (
        <div className="container py-5">
            <div className="row g-4">
                {features.map((feature, index) => (
                    <div key={index} className="col-md-4">
                        <FeatureCard
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AboutFeatures;