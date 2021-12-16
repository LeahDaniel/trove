import { Form, FormGroup, Input } from "reactstrap"

export const TagSearch = ({ setUserEntry, userEntry }) => {
    return (
        <Form inline>
            <FormGroup >
                <Input
                    id="titleSearch"
                    type="search"
                    placeholder="Search..."
                    bsSize="sm"
                    className="fs-6 "
                    value={userEntry}
                    onChange={(event) => {
                        setUserEntry(event.target.value)
                    }}
                    
                />
            </FormGroup>
        </Form>
    )
}