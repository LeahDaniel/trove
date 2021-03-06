import React, { useRef, useState } from "react"
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom"
import { Button, Form, FormGroup, Input, Label } from "reactstrap";

export const Login = () => {
    const [email, set] = useState("")
    const existDialog = useRef()
    const history = useHistory()

    const existingUserCheck = () => {
        return fetch(`http://localhost:8088/users?email=${email}`)
            .then(res => res.json())
            .then(user => user.length ? user[0] : false)
    }

    const handleLogin = (e) => {
        e.preventDefault()
        existingUserCheck()
            .then(exists => {
                if (exists) {
                    localStorage.setItem("trove_user", exists.id)
                    history.push("/")
                } else {
                    existDialog.current.showModal()
                }
            })
    }

    return (
        <main className="row justify-content-center my-5">
            <div className="my-5 p-5 col-9 gradient rounded border shadow-sm">
                <dialog className="border-0" ref={existDialog} >
                    <div className="d-flex flex-column">
                        <div><Button close onClick={e => existDialog.current.close()} className="float-end" /></div>
                        <div className="m-4 pb-3">User does not exist. Please try again.</div>
                    </div>
                </dialog>


                <Form onSubmit={handleLogin}>
                    <h1 className="pt-4">Trove</h1>
                    <h5 className="pt-4">Please Log In</h5>
                    <FormGroup className="pt-3">
                        <Label htmlFor="inputEmail"> Email address </Label>
                        <Input type="email"
                            onChange={evt => set(evt.target.value)}
                            placeholder="Email address"
                            required autoFocus />
                    </FormGroup>
                    <FormGroup className="pt-3">
                        <Button type="submit" color="info">
                            Sign in
                        </Button>
                    </FormGroup>
                </Form>
                <div className="pt-3">
                    <Link to="/register">Not a member yet?</Link>
                </div>
            </div>
        </main>
    )
}

