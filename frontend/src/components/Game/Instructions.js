import React, {Fragment} from "react";
import {Helmet} from 'react-helmet';
import {Link} from 'react-router-dom';

const Instructions = () => (
    <Fragment>
        <Helmet>
            <title>Game Instructions</title>
        </Helmet>
        <div className="instructions container">
            <h1>How to Play</h1>
            <p>Ensure you read this guide from start to finish.</p>
            <ul className="browser-default" id='main-list'>
                <li>Duration</li>
                <li>Number of Qestions</li>
                <li>
                    Each question contains 4 options.
                </li>
                <li>
                    Select answer by clicking.
                </li>
                <li>
                    Each game has 2 life-lines.
                    <ul id="sublist">
                        <li>2 50-50 chances</li>
                        <li>5 hints</li>
                    </ul>
                </li>
            </ul>
            <div>
                <span className="left"><Link to='/attempt-game'>No take me back</Link></span>
                <span className="right"><Link to='/play/game'>Let's Play</Link></span>
            </div>
        </div>
    </Fragment>
);



export default Instructions;