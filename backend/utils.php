<?php
/**
 *  Date: 04/18/2020
 *  Description: Viniel Software Solutions DATABASE CONNECTION
 */

class Query{

    /** SELECT */
    function _select($con){
        $query = "SELECT ".$this->selected." FROM ".$this->table." WHERE ".$this->fields;
        return mysqli_query($con, $query);
    }

    /** INSERT */
    function _insert($con){
        $query = "INSERT INTO ".$this->table." (".$this->selected.") VALUES (".$this->fields.")";
        return mysqli_query($con, $query);
    }

    /** UPDATE */
    function _update($con){
        $query = "UPDATE ".$this->table." SET ".$this->selected." WHERE ".$this->fields;
        return mysqli_query($con, $query);
    }

    /** DELETE */
    function _delete($con){
        $query = "DELETE FROM ".$this->table." WHERE ".$this->fields;
        return mysqli_query($con, $query);
    }
    
}

// System Date
function SysDate(){
    date_default_timezone_set('Asia/Manila');
    $info = getdate();
    $date = $info['mday'];
    $month = $info['mon'];
    $year = $info['year'];
    $dat_e = $year."-".$month."-".$date;
    if(!empty($year) && !empty($month) && !empty($date)){
        return $dat_e;
    }else{
        return $dat_e;
    }
}

// System Time
function SysTime(){
    date_default_timezone_set('Asia/Manila');
    $info = getdate();
    $hour = $info['hours'];
    $min = $info['minutes'];
    $sec = $info['seconds'];
    $time = $hour.":".$min.":".$sec;
    if(!empty($hour) && !empty($min) && !empty($sec)){
        return $time;
    }else{
        return $time;
    }
}

?>