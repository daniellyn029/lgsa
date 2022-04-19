<?php
require_once('../database.php');
require_once('../utils.php');
$conn = new connector();
$con = $conn->connect();

$date = SysDate();
$time = SysTime();

    $data = array(     
        "add_prof_pic"		    => 'frontend/assets/images/profile_pic/user-icon.png?'.time(),
        "add_picFile"       => '',
        "add_employeeid"    => '',
        "add_firstname"     => '',
        "add_middlename"    => '',
        "add_lastname"      => '',
        "add_suffix"        => '',
        "add_present_address"=> '',
        "add_provincial_address"=> '',
        "add_gender"        => '',
        "add_birthdate"     => '',
        "add_age"           => '',
        "add_birthplace"    => '',
        "add_emergency"     => '',
        "add_relationship"  => '',
        "add_emeradd"       => '',
        "add_emernum"       => '',
        "add_height"        => '',
        "add_weight"        => '',
        "add_cpnum"         => '',
        "add_civil_status"  => '',
        "add_spouse"        => '',
        "add_spouse_add"    => '',
        "add_supported"     => '',
        "add_supp_rel"      => '',
        "add_work_desire"   => '',
        "add_sal_exp"       => '',
        "add_intro"         => '',
        "add_hob_rec"       => '',
        "add_elem_scho"     => '',
        "add_elem_year"     => '',
        "add_high_scho"     => '',
        "add_high_year"     => '',
        "add_coll_scho"     => '',
        "add_coll_year"     => '',
        "add_deg_scho"      => '',
        "add_deg_year"      => '',
        "add_vo_scho"       => '',
        "add_vo_year"       => '',
        "add_prev_emp"      => '',
        "add_prev_add"      => '',
        "add_from"          => '',
        "add_to"            => '',
        "add_salar"         => '',
        "add_work_done"     => '',
        "add_reas_leav"     => '',
        "add_sss"           => '',
        "add_philhealth"    => '',
        "add_pagibig"       => '',
        "add_tax"           => '',

    );

    $return = json_encode($data);


print $return;


?>