<?php
require_once('../database.php');
require_once('../utils.php');
$conn = new connector();
$con = $conn->connect();

//Get User Name
function getAccountName($con, $id){
    $Qry=new Query();
    $Qry->table="lgsa_user";
    $Qry->selected="CONCAT(lgsa_user_firstname,' ',LEFT(lgsa_user_middlename,1),'. ',lgsa_user_lastname) AS fullname";
    $Qry->fields="lgsa_user_employee_id='".$id."'";
    $rs=$Qry->_select($con);
    if(mysqli_num_rows($rs)>=1){
        if($row=mysqli_fetch_array($rs)){
            return $row['fullname'];
        }
    }
    return null;
}

//Get Employee Name
function getEmployeeName($con, $id){
    $Qry=new Query();
    $Qry->table="lgsa_employee";
    $Qry->selected="CONCAT(lgsa_guard_firstname,' ',LEFT(lgsa_guard_middlename,1),'. ',lgsa_guard_lastname) AS fullname";
    $Qry->fields="lgsa_guard_employee_id='".$id."'";
    $rs=$Qry->_select($con);
    if(mysqli_num_rows($rs)>=1){
        if($row=mysqli_fetch_array($rs)){
            return $row['fullname'];
        }
    }
    return null;
}


//Get Client Name
function getClientName($con, $id){
    $Qry=new Query();
    $Qry->table="lgsa_client";
    $Qry->selected="lgsa_client_business_name";
    $Qry->fields="lgsa_client_id ='".$id."'";
    $rs=$Qry->_select($con);
    if(mysqli_num_rows($rs)>=1){
        if($row=mysqli_fetch_array($rs)){
            return $row['lgsa_client_business_name'];
        }
    }
    return null;
}

//Get Control Number
function getCount($con, $control_name, $tbl){
    $Qry = new Query();
    $Qry->table = $tbl;
    $Qry->selected = "lgsa_count_counter";
    $Qry->fields="lgsa_count_control_name='".$control_name."'";
    $rs = $Qry->_select($con);
    if(mysqli_num_rows($rs)>=1){
        if($row=mysqli_fetch_array($rs)){
            $return = (int)$row['lgsa_count_counter'] + 1;
        }
    }
    return $return;
}

//Get Voucher Particulars
function getVoucherParticulars($con, $voucher_id){
    $Qry=new Query();
    $Qry->table="lgsa_voucher AS lv LEFT JOIN lgsa_voucher_particulars AS lvp ON lv.lgsa_control_no = lvp.lgsa_control_no";
    $Qry->selected="lvp.lgsa_voucher_particulars,lvp.lgsa_voucher_amount";
    $Qry->fields="lv.`lgsa_voucher_id`='".$voucher_id."'";
    $rs=$Qry->_select($con);
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){
            $data[] = array(
                'particulars'=>$row['lgsa_voucher_particulars'],
                'amount'=>$row['lgsa_voucher_amount'],

            );
        } 
        return $data;
    }
  
}	

// Get Cash Advance Name
function getCashAdvanceName($con, $cashadvance_id){
    $Qry=new Query();
    $Qry->table="lgsa_cash_advance AS lca LEFT JOIN lgsa_cashadvance_employee_name AS lcen ON lca.lgsa_cash_advance_control_no = lcen.lgsa_cashadvance_control_no";
    $Qry->selected="lcen.lgsa_cashadvance_employee_id,lcen.lgsa_cashadvance_name,lcen.lgsa_cashadvance_employee_amount";
    $Qry->fields="lca.lgsa_cash_advance_id='".$cashadvance_id."'";
    $rs=$Qry->_select($con);
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){
            $data[] = array(
                'cashadvance_employee_id'=>$row['lgsa_cashadvance_employee_id'],
                'cashadvance_employee_name'=>$row['lgsa_cashadvance_name'],
                'amount'=>$row['lgsa_cashadvance_employee_amount']

            );
        } 
        return $data;
    }
  
}	

?>