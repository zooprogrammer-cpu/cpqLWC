({
   doInit: function(component,event,helper){
       console.log(component.get("v.recordId")); 
   },

   refreshTab: function(component,event,helper){
        console.log("Refresh Tab");
        let workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo()
        .then((response)=>{
            let focusedTabId = response.tabId;
            workspaceAPI.refreshTab({
                tabID: focusedTabId
            });
        })
        .catch(error=>{
            console.log('Error refreshing lightning console tab')
        })
   },

   closeQuickAction : function(component,event,helper){
       console.log('{!c.closeAction}');
       $A.get("e.force:closeQuickAction").fire();
   },

   onPageReferenceChanged: function(cmp,event,helper){
       var myPageRef = cmp.get("v.pageReference");
       var recordId = myPageRef.state.c__recordId;
       cmp.set("c.recordId", recordId);
       $A.get('e.force:refreshView').fire(); 
   }
})
