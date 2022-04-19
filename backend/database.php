<?php
/**
 *  Date: 04/18/2020
 *  Description: Viniel Software Solutions DATABASE CONNECTION
 */

// header('Content-Type: application/json');

class connector{

    public $host = "localhost";
    public $dbname = "db_lgsa";
    public $name = "root";
    public $pass = "";
    function connect(){
        $conn = mysqli_connect("$this->host", "$this->name", "$this->pass");
        if(!$conn){
            die('Could not connect: ' . mysqli_error());
        }
        mysqli_select_db($conn, "$this->dbname") or die("Unable to connect");
        $conn->set_charset("utf8");
        return $conn;
    }
}


?>