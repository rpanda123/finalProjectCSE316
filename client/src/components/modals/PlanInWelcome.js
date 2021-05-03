import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
const WelCome = () => {

    return (

        <div className="wrap-welcome-page">
            <div className="welcome-page">
                <div className="image-planet"></div>
                <div style={{ width: '100%', height: '30px' }}></div>
                <div className="wrap-content-welcome">
                    <h3 className="h3-content">Welcome To The</h3>
                    <h3 className="h3-content">World Data Mapper</h3>
                </div>
                <div style={{width:'100%', height:'50px'}}></div>

            </div>
        </div>
    )
}

export default WelCome;
