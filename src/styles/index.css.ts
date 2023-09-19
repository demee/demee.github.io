import {style} from '@vanilla-extract/css';

export const headerStyle = style({
    display: "flex",
    justifyContent: 'space-between', /* Spread elements across the page */
    alignItems: 'center', /* Vertically align to the image */
    padding: '10px', /* Add some padding for spacing */
})