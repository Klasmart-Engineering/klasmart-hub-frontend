import assesment1 from "@/assets/img/AdaptiveLearningJourney/assesment1.png";
import assesment2 from "@/assets/img/AdaptiveLearningJourney/assesment2.png";
import assesment3 from "@/assets/img/AdaptiveLearningJourney/assesment3.png";
import assesment4 from "@/assets/img/AdaptiveLearningJourney/assesment4.png";
import assesment5 from "@/assets/img/AdaptiveLearningJourney/assesment5.png";
import assesment6 from "@/assets/img/AdaptiveLearningJourney/assesment6.png";
import rocket from "@/assets/img/AdaptiveLearningJourney/rocket.png";
import React from "react";

export default [
    {
        level: 1,
        ratings : 3,
        completed: true,
        type: `live`,
        category : assesment1,
        hasBooster : false,
        boosterRatings : 0,
        boosterCompleted : true,
        boosterCategory: rocket,
        slides: 0,
    },
    {
        level: 2,
        ratings : 1,
        completed: true,
        type: `study`,
        category : assesment2,
        hasBooster : true,
        boosterRatings : 0,
        boosterCompleted : true,
        boosterCategory: rocket,
        slides: 0,
    },
    {
        level: 3,
        ratings : 2,
        completed: true,
        type: `live`,
        category : assesment3,
        hasBooster : false,
        boosterRatings : 0,
        boosterCompleted : true,
        boosterCategory: rocket,
        slides: 0,
    },
    {
        level: 4,
        ratings : 1,
        completed: true,
        type: `study`,
        category : assesment4,
        hasBooster : true,
        boosterRatings : 0,
        boosterCompleted : false,
        boosterCategory: rocket,
        slides: 4,
    },
    {
        level: 5,
        ratings : 0,
        completed: false,
        type: `live`,
        category : assesment1,
        hasBooster : false,
        boosterRatings : 0,
        boosterCompleted : false,
        boosterCategory: rocket,
        slides: 0,
    },
    {
        level: 6,
        ratings : 0,
        completed: false,
        type: `live`,
        category : assesment2,
        hasBooster : false,
        boosterRatings : 0,
        boosterCompleted : false,
        boosterCategory: rocket,
        slides: 0,
    },
    {
        level: 7,
        ratings : 0,
        completed: false,
        type: `study`,
        category : assesment3,
        hasBooster : false,
        boosterRatings : 0,
        boosterCompleted : false,
        boosterCategory: rocket,
        slides: 0,
    },
    {
        level: 8,
        ratings : 0,
        completed: false,
        type: `study`,
        category : assesment4,
        hasBooster : false,
        boosterRatings : 0,
        boosterCompleted : false,
        boosterCategory: rocket,
        slides: 0,
    },
    {
        level: 9,
        ratings : 0,
        completed: false,
        type: `study`,
        category : assesment5,
        hasBooster : false,
        boosterRatings : 0,
        boosterCompleted : false,
        boosterCategory: rocket,
        slides: 0,
    },
    {
        level: 10,
        ratings : 0,
        completed: false,
        type: `live`,
        category : assesment6,
        hasBooster : false,
        boosterRatings : 0,
        boosterCompleted : false,
        boosterCategory: rocket,
        slides: 0,
    },
];

interface Star {
    fill : string;
}

export const Star =(props : Star) => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
            d="M14.9202 5.70997C14.0834 5.38561 13.2155 5.1477 12.3302 4.99997C11.9076 4.95163 11.5051 4.79319 11.1629 4.54049C10.8207 4.28779 10.5508 3.94968 10.3802 3.55997C9.89281 2.51972 9.25609 1.55622 8.49023 0.699973C8.35602 0.570438 8.17676 0.498047 7.99023 0.498047C7.8037 0.498047 7.62445 0.570438 7.49023 0.699973C6.73173 1.54349 6.09551 2.48941 5.60023 3.50997C5.42553 3.90652 5.14798 4.24914 4.79632 4.50233C4.44467 4.75552 4.03171 4.91007 3.60023 4.94997C2.70973 5.1132 1.83845 5.36788 1.00023 5.70997C0.82321 5.79831 0.687614 5.9522 0.622258 6.13893C0.556901 6.32567 0.566937 6.53052 0.650231 6.70997C1.18662 7.68448 1.86016 8.57692 2.65023 9.35997C2.92073 9.62897 3.12136 9.96002 3.23465 10.3243C3.34794 10.6886 3.37046 11.075 3.30023 11.45C3.20023 12.67 3.11023 13.71 3.13023 14.51C3.13621 14.6387 3.17319 14.764 3.23803 14.8754C3.30287 14.9867 3.39364 15.0808 3.50263 15.1495C3.61162 15.2183 3.7356 15.2596 3.86402 15.2702C3.99244 15.2807 4.12151 15.26 4.24023 15.21C5.14785 14.9167 6.03342 14.5591 6.89023 14.14C7.22412 13.9561 7.59908 13.8597 7.98023 13.8597C8.36138 13.8597 8.73634 13.9561 9.07023 14.14C9.9296 14.5611 10.8186 14.9187 11.7302 15.21C11.8483 15.2604 11.9769 15.2814 12.1049 15.2709C12.2329 15.2605 12.3565 15.219 12.4648 15.15C12.5732 15.0811 12.6631 14.9867 12.7267 14.8752C12.7904 14.7637 12.8259 14.6383 12.8302 14.51C12.8302 13.71 12.7602 12.67 12.6602 11.45C12.59 11.075 12.6125 10.6886 12.7258 10.3243C12.8391 9.96002 13.0397 9.62897 13.3102 9.35997C14.1003 8.57692 14.7738 7.68448 15.3102 6.70997C15.3515 6.61888 15.3742 6.52045 15.3769 6.42048C15.3795 6.3205 15.3622 6.221 15.3259 6.12782C15.2895 6.03465 15.2349 5.94968 15.1653 5.87792C15.0956 5.80616 15.0123 5.74906 14.9202 5.70997Z"
            fill={props.fill}/>
    </svg>
);
