import { Form, FormGroup, Input, Label } from "reactstrap"

export const TagSearch = ({ setUserEntry }) => {
    return (
        <Form inline>
            <FormGroup floating >
                <Input
                    id="titleSearch"
                    type="search"
                    placeholder="Search by Title"
                    onChange={(event) => {
                        setUserEntry(event.target.value)
                    }}
                    
                />
                <Label for="titleSearch">
                    Search by Title
                </Label>
            </FormGroup>
        </Form>
    )
}