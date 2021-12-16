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

    const updateUser = (evt) => {
        const copy = { ...user }
        copy[evt.target.id] = evt.target.value
        setUser(copy)
    }

    const postDefaultTags = (createdUser) => {
        const defaultTagArray = ["Action", "Adventure", "Comedy", "Crime", "Drama", "Mystery", "Fantasy", "Historical", "Horror", "Romance", "Science Fiction",
            "Thriller", "Western", "Platformer", "Shooter", "Stealth", "Survival", "Rhythm", "Battle Royale", "RPG", "MMO", "Life Sim", "Construction and Management Sim",
            "Vehicle Sim", "Strategy", "MOBA", "Tower Defense", "Turn-based Strategy", "Racing", "Esports", "Casual",
            "Board/Card Game", "Casino", "Idle", "Puzzle", "Logic", "Party", "Trivia", "Educational", "Sandbox",
            "Creative", "Open world"
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

    return (
        <main className="mx-4">
            <dialog className="dialog dialog--password" ref={conflictDialog}>
                <div>Account with that email address already exists</div>
                <Button close onClick={e => conflictDialog.current.close()} className="text-right" />
            </dialog>

            <Form onSubmit={handleRegister}>
                <h1 className="pt-5">Trove</h1>
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
                    <Button type="submit"> Register </Button>
                </FormGroup>
            </Form>

        </main>
    )
}

