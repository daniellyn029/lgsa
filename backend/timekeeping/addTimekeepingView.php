<?php

    $data = array( 
        'establishment'                 =>'',
        'period_covered_from'           =>'',
        'period_covered_to'             =>'',
        'tk'                            => array(
                                            'employee_id'                           =>array(),
                                            'day_one'                               =>array(),
                                            'day_two'                               =>array(),
                                            'day_three'                             =>array(),
                                            'day_four'                              =>array(),
                                            'day_five'                              =>array(),
                                            'day_six'                               =>array(),
                                            'day_seven'                             =>array(),
                                            'day_eight'                             =>array(),
                                            'day_nine'                              =>array(),
                                            'day_ten'                               =>array(),
                                            'day_eleven'                            =>array(),
                                            'day_twelve'                            =>array(),
                                            'day_thirteen'                          =>array(),
                                            'day_fourteen'                          =>array(),
                                            'day_fifteen'                           =>array(),
                                            'first_row_overtime'                    =>array(),
                                            'first_row_hours'                       =>array(),
                                            'first_row_no_of_days'                  =>array(),

                                            'day_sixteen'                           =>array(),
                                            'day_seventeen'                         =>array(),
                                            'day_eighteen'                          =>array(),
                                            'day_nineteen'                          =>array(),
                                            'day_twenty'                            =>array(),
                                            'day_twenty_one'                        =>array(),
                                            'day_twenty_two'                        =>array(),
                                            'day_twenty_three'                      =>array(),
                                            'day_twenty_four'                       =>array(),
                                            'day_twenty_five'                       =>array(),
                                            'day_twenty_six'                        =>array(),
                                            'day_twenty_seven'                      =>array(),
                                            'day_twenty_eight'                      =>array(),
                                            'day_twenty_nine'                       =>array(),
                                            'day_thirty'                            =>array(),
                                            'day_thirty_one'                        =>array(),
                                            'day_overtime2'                         =>array(),
                                            'second_row_hours'                      =>array(),
                                            'second_row_days'                       =>array(),
                                            'total_overtime'                        =>array(),
                                            'total_work_hours'                      =>array(),
                                            'total_no_days'                         =>array()

                                        )
    );

$return = json_encode($data);
print $return;

?>



