module.exports = function todoitem(description, completiondate, status){
    this.description = description;
    this.completiondate = completiondate;
    this.status = status;

    this.getdescription = function (){
        return description;
    }
};

/*todoitem.prototype.description()
{
    return description;
}

todoitem.prototype.status()
{
    return status;
}*/