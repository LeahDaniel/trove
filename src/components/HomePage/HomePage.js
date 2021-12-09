import React from 'react';

export const HomePage = (props) => {
    return (
        <>
            <div className="pt-5 mx-4">
                <p>Please use the navigation bar above to find the list of media you'd like to look through.</p>
                <p className="pt-3">Each media type has a:</p>
                <ul>
                    <li>Current List (for media you are currently watching/playing/etc)</li>
                    <li>Queue (for media you've been recommended or want to watch/play/etc in the future)</li>
                    <li>Option to add a new entry</li>
                </ul>
            </div>
        </>
    )
}