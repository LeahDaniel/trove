import { Form, FormGroup, Input } from "reactstrap"

export const TagSearch = ({ setUserEntry, userEntry }) => {
    return (
        <Form inline className="col-11">
            <FormGroup >
                <Input
                    id="titleSearch"
                    type="search"
                    placeholder="Search..."
                    className="fs-5"
                    value={userEntry}
                    onChange={(event) => {
                        setUserEntry(event.target.value)
                    }}
                    
                />
            </FormGroup>
        </Form>
    )
}