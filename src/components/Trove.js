import React from "react";
import { Route, Redirect } from "react-router-dom";
import { ApplicationViews } from "./ApplicationViews";
import { NavBar } from "./nav/NavBar";
import { Login } from "./auth/Login";
import { Register } from "./auth/Register";

export const Trove = () => (
    <>
        <Route
            render={() => {
                // if there is a user logged in, show the navbar and app
                if (localStorage.getItem("trove_user")) {
                    return (
                        <>
                            <NavBar />
                            <ApplicationViews/>
                        </>
                    );
                //otherwise show the login page
                } else {
                    return <Redirect to="/login" />;
                }
            }}
        />

        <Route path="/login">
            <Login />
        </Route>
        <Route path="/register">
            <Register />
        </Route>
    </>
);
