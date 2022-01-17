import React, { useRef, useState } from "react"
import { useHistory } from "react-router-dom"
import { Button, Form, FormGroup, Input, Label } from "reactstrap"
import { TagRepo } from "../../repositories/TagRepo"

export const Register = (props) => {
    const [user, setUser] = useState({})
    const conflictDialog = useRef()

    const history = useHistory()

    const existingUserCheck = () => {
        return fetch(`http://localhost:8088/users?email=${user.email}`)
            .then(res => res.json())
            .then(user => !!user.length)
    }
    const handleRegister = (e) => {
        e.preventDefault()
        existingUserCheck()
            .then((userExists) => {
                if (!userExists) {
                    fetch("http://localhost:8088/users", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(user)
                    })
                        .then(res => res.json())
                        .then(postDefaultTags)
                }
                else {
                    conflictDialog.current.showModal()
                }
            })
    }

    const postDefaultTags = (createdUser) => {
        const defaultTagArray = ["Action", "Adventure", "Comedy", "Drama", "Mystery",
            "Fantasy", "Historical", "Horror", "Romance", "Science Fiction", "Thriller",
            "Western", "Platformer", "Shooter", "Survival", "Battle Royale", "RPG",
            "Simulator", "Strategy", "Esports", "Casual", "Educational", "Sandbox", "Open world"
        ]
        let promiseArray = []
        for (const item of defaultTagArray) {
            TagRepo.addTag({
                tag: item,
                userId: createdUser.id
            })
        }
        Promise.all(promiseArray)
            .then(() => {
                if (createdUser.hasOwnProperty("id")) {
                    localStorage.setItem("trove_user", createdUser.id)
                    history.push("/")
                }
            })
    }

    const updateUser = (evt) => {
        const copy = { ...user }
        copy[evt.target.id] = evt.target.value
        setUser(copy)
    }

    return (
        <main className="row justify-content-center my-5">
            <div className="my-5 p-5 col-9 gradient rounded border shadow-sm">
                <dialog className="dialog dialog--password" ref={conflictDialog}>
                    <div>Account with that email address already exists</div>
                    <Button close onClick={e => conflictDialog.current.close()} color="info" className="text-white text-right" />
                </dialog>

                <Form onSubmit={handleRegister}>
                    <h1 className="pt-4">Trove</h1>
                    <h5 className="pt-4">Please Register</h5>
                    <FormGroup className="pt-3">
                        <Label htmlFor="name"> Full Name </Label>
                        <Input onChange={updateUser}
                            type="text" id="name"
                            placeholder="Enter your name" required autoFocus />
                    </FormGroup>
                    <FormGroup className="pt-3">
                        <Label htmlFor="email"> Email address </Label>
                        <Input onChange={updateUser} type="email" id="email" placeholder="Email address" required />
                    </FormGroup>
                    <FormGroup className="pt-3">
                        <Button color="info" type="submit"> Register </Button>
                    </FormGroup>
                </Form>
            </div>
        </main>
    )
}

