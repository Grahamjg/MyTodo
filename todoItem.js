module.exports = exports = function todoitem(description, status){
    var description = description;
    var status = status;

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