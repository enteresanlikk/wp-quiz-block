<?php
/*
 * Plugin Name: Quiz Block
 * Version: 1.0.0
 * Author: Bilal Demir
 * Author URI: https://bilaldemir.dev
 */

if(!defined('ABSPATH')) exit;

class QuizBlock {
    public function __construct()
    {
        add_action('init', [$this, 'AdminInit']);
    }

    public function AdminInit() {
        register_block_type(
            __DIR__,
            [
                'render_callback' => [$this, 'Render']
            ]
        );
    }

    public function Render($attributes) {
        ob_start();
    ?>
        <div class="quiz-block"><pre class="d-none"><?= wp_json_encode($attributes) ?></pre></div>
    <?php
        return ob_get_clean();
    }
}

new QuizBlock();