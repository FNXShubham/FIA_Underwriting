import { api, LightningElement, track, wire } from 'lwc';
import getContentDetails from '@salesforce/apex/FilePreviewController.getAllRelatedDocuments';
import getLoginURL from '@salesforce/apex/FilePreviewController.getLoginURL';
import getPublicURL from '@salesforce/apex/FilePreviewController.getFilePublicURL';
import getFileApproved from '@salesforce/apex/FilePreviewController.getFileApproved';
import getFileRejection from '@salesforce/apex/FilePreviewController.getFileRejected';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const columns = [
    { label: 'Title',       fieldName: 'Title', wrapText : false,
        cellAttributes: { 
            iconName: { fieldName: 'icon' }, iconPosition: 'left' 
        }
    },
    { label: 'Stipulation Name',   fieldName: 'Stipulation_Name__c' },  
    { label: 'Status',   fieldName: 'Status__c' },
    //{ label: 'File Size',   fieldName: 'Size' },
    { label: 'Preview', type:  'button', typeAttributes: { 
            name: 'Preview', iconName: 'utility:preview'
        } 
    },
    { label: 'Approval', type:  'button', typeAttributes: { 
            name: 'Approve', iconName: 'action:approval'
        }
    },
    { label: 'Reject', type:  'button', typeAttributes: { 
            name: 'Reject', iconName: 'action:reject'
        } 
    } 
];

export default class FilePreview extends NavigationMixin(LightningElement) {

    @api title;
    @api showDetails;
    @api showFileUpload;
    @api showsync;
    @api recordId;
    @api usedInCommunity;
    @api showFilters;
    @api accept = '.csv,.doc,.xsl,.pdf,.png,.jpg,.jpeg,.docx,.doc';
    @track showframe = false;
    @track showpopup = false;
    @track fileurl;
    @track contentdocid;
    @track dataList;
    @track columnsList = columns;
    @track stipComment;
    isLoading = false;

    wiredFilesResult;

    connectedCallback() {
        this.handleSync();
    }

    getBaseUrl(){
        let baseUrl = 'https://'+location.host+'/';
        getLoginURL()
        .then(result => {
             baseUrl = result;
             console.log(':::::::::->'+baseUrl);
        })
        .catch(error => {
             console.error('Error: \n ', error);
        });
        return baseUrl;
    }

    handleRowAction(event){

        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'Preview':
                this.previewFile(row);
                break;
            case 'Approve':
                this.approveFile(row);
                break;
            case 'Reject':
                this.addComment(row);
                break;
            default:
        }

    }

     previewFile(file){
        console.log('---->'+JSON.stringify(file));
        this.showframe = true;
        getPublicURL({
            documentId : file.ContentDocumentId
        })
        .then(result => {
            console.log('Result::'+result.DistributionPublicUrl);
            this.fileurl = result.DistributionPublicUrl;
        }).catch(error => {
            console.log('@#@#@#'+error);
        });
        //this.contentdocid = file.ContentDocumentId;
        //console.log('URL::'+this.fileurl);
        
    }
    approveFile(file){
        console.log('::::'+JSON.stringify(file));
        getFileApproved({
            documentId : file.Id
        })
        .then(result => {
            if(result !== undefined) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'File Approved successfully',
                        variant: 'success',
                    }),
                );
            }
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'File Approval Failed',
                    message: error.body.message,
                    variant: 'error',
                }),
            );
        })
    }
    openFile(){
            window.open(this[NavigationMixin.Navigate]({
                 type: 'standard__webPage',
                attributes: {
                    url: this.fileurl
                }
            }, false ));
    }

    downloadFile(file){
        this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: file.downloadUrl
                }
            }, false 
        );
    }

    handleSync(){

        let imageExtensions = ['png','jpg','gif'];
        let supportedIconExtensions = ['ai','attachment','audio','box_notes','csv','eps','excel','exe',
                        'flash','folder','gdoc','gdocs','gform','gpres','gsheet','html','image','keynote','library_folder',
                        'link','mp4','overlay','pack','pages','pdf','ppt','psd','quip_doc','quip_sheet','quip_slide',
                        'rtf','slide','stypi','txt','unknown','video','visio','webex','word','xml','zip','doc','docx'];

        this.isLoading = true;
        getContentDetails({
            recordId : this.recordId
        })
        .then(result => {
            console.log('!!!!!'+result);
            let parsedData = JSON.parse(result);
            let stringifiedData = JSON.stringify(parsedData);
            let finalData = JSON.parse(stringifiedData);
            let baseUrl = this.getBaseUrl();
            finalData.forEach(file => {
                file.downloadUrl = baseUrl+'sfc/servlet.shepherd/document/download/'+file.ContentDocumentId;
                file.fileUrl     = baseUrl+'sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId='+file.Id;
                file.CREATED_BY  = file.ContentDocument.CreatedBy.Name;
                file.Size        = this.formatBytes(file.ContentDocument.ContentSize, 2);
                
                let fileType = file.ContentDocument.FileType.toLowerCase();
                if(imageExtensions.includes(fileType)){
                    file.icon = 'doctype:image';
                }else{
                    if(supportedIconExtensions.includes(fileType)){
                        file.icon = 'doctype:' + fileType;
                    }
                }
            });
            this.dataList = finalData;
        })
        .catch(error => {
            console.error('**** error **** \n ',error)
        })
        .finally(()=>{
            this.isLoading = false;
        });
    }

    handleUploadFinished(){
        this.handleSync();
        //eval("$A.get('e.force:refreshView').fire();");
    }
    formatBytes(bytes,decimals) {
        if(bytes == 0) return '0 Bytes';
        var k = 1024,
            dm = decimals || 2,
            sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    handleSearch(event){
        let value = event.target.value;
        let name  = event.target.name;
        if( name === 'Title' ){
            this.dataList = this.dataList.filter( file => {
                return file.Title.toLowerCase().includes(value.toLowerCase());
            });
        } else if( name === 'Created By' ){
            this.dataList = this.dataList.filter( file => {
                return file.CREATED_BY.toLowerCase().includes(value.toLowerCase());
            });
        }
    }
    handleStipComment(event){
        this.stipComment = event.target.value;
    }
    addComment(file){
        console.log('!!::'+file);
        this.contentdocid = file.Id;
        this.showpopup = true;
    }
    rejectFile(){
        getFileRejection({
            documentId : this.contentdocid,
            comments : this.stipComment
        })
        .then(result => {
            if(result !== undefined) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'File Rejected!',
                        variant: 'success',
                    }),
                );
            }
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'File Rejection Failed',
                    message: error.body.message,
                    variant: 'error',
                }),
            );
        })
        this.showpopup = false;
    }
    closeCommentPopUp(){
        this.showpopup = false;
    }
}