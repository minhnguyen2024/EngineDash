const US_STATES = ["Select a State",'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI',
'ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']
export default function EngineSearch(){
    return <div>
        <p> Engine Search</p>
        <form method="post">
            <label>Choose Your State 
                <select name="state" id="state">
                    { US_STATES.map(state =>(
                        <option key={state} value={state}>{state}</option>
                    ))}
                </select>
            </label>
        </form>
    </div>
}