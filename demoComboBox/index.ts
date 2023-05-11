import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { ITag } from '@fluentui/react/lib/Pickers';
import { ComboBox, IComboBoxProps } from "./ComboBox";
import { dataSchema, dataExample  } from "./Dataschema";
import * as React from "react";

export class demoComboBox implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private notifyOutputChanged: () => void;
    private suggestions: ITag[] = [];
    private searchString: string = "";
    private resolveSearch?: (value: ITag[] | Promise<ITag[]>) => void;
    private selectedRecords: typeof dataExample = {
        Count: 0,
        Records: []
    } ;
      

    /**
     * Empty constructor.
     */
    constructor() { }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {

        const recordsInput = context.parameters.Records;

        if(this.resolveSearch && !recordsInput.loading){
            this.suggestions = this.getRecords(recordsInput);
            this.resolveSearch(this.suggestions);
            this.resolveSearch = undefined;
        }
        
        const props: IComboBoxProps = { 
            onResolveSuggestions:  this.getSuggestions,
            onChange: this.onChange
        };
        
        return React.createElement(
            ComboBox, props
        );
    }

    getSuggestions = (filterText: string, tagList?: ITag[]): ITag[] | Promise<ITag[]> => {
        this.searchString = filterText;
        return new Promise<ITag[]>((resolve) => {
            this.resolveSearch = resolve;
            this.notifyOutputChanged();
        });
    }

    onChange = (items?: ITag[] | undefined): void => {
        this.selectedRecords.Count = items?.length ?? 0;
        this.selectedRecords.Records = items?.map((item) => {return {Key: item.key as string, Value: item.name}}) ?? [];
        console.log(this.selectedRecords);
        this.notifyOutputChanged();
    }

    getRecords = (recordsInput: ComponentFramework.PropertyTypes.DataSet): ITag[] => {

        const recordsArrayToReturn: ITag[] = [];
        if(recordsInput.sortedRecordIds.length > 0){
            recordsInput.sortedRecordIds.forEach((recordId) => {
                const record = recordsInput.records[recordId];
                const key = record.getValue("RecordKey") as string;
                const value = record.getValue("RecordDisplayName") as string;

                recordsArrayToReturn.push({key: key, name: value});
            })
        }
        return recordsArrayToReturn;
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return { 
            SearchString: this.searchString,
            SelectedRecords: this.selectedRecords
        };
    }

    public async getOutputSchema(context: ComponentFramework.Context<IInputs>): Promise<Record<string, unknown>> { 
        
        console.log("getOutputSchema");
        console.log(dataSchema);
        return Promise.resolve({
            SelectedRecords: dataSchema
        })
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
