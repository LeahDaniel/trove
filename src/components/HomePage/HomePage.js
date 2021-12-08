import React from 'react';

export const HomePage = (props) => {
    return (
        <>
            <h2>Trove</h2>
            <div>
                <p>Please use the navigation bar above to find the list of media you'd like to look through.</p>
                <p>Each media type has a:</p>
                <ul>
                    <li>Current List (for media you are currently consuming)</li>
                    <li>Queue (for media you've been recommended or want to consume in the future)</li>
                    <li>Option to add a new entry</li>
                </ul>
            </div>
        </>
    )
}