<?php
    $cart  = isset($_POST['cart']) ? $_POST['cart'] : [];
    $sum = isset($_POST['cart_sum']) ? $_POST['cart_sum'] : [];
    echo "Sum: ".$sum;

    if (is_array($cart)) {
        foreach ($cart as $item) {
            $json = json_decode($item); //{id:1, count:2, price:850}

            echo "<h2 style='margin-bottom:5px;'>Item: "."</h2>";
            foreach($json as $key => $value) {
                //пропускаем массивы аля size:[xs, m, l]
                if (is_string($value) || is_numeric($value)) {
                    echo '<div style="display: flex; padding: 0 0 10px 0; flex-direction: row;"><div style="width:100px;">'.$key . "</div><div>" . $value . "</div></div>";
                }
            }
            //echo  $json->{'id'}.'<br /><br />';
        }
    }
    echo '<br/><br/><br/>';
    print_r($_POST);
?>